import type * as Party from "partykit/server";

type Cursor = {
  x: number;
  y: number;
  name: string;
  color: string;
};

type CursorMessage = {
  type: "cursor";
  cursor: Cursor;
};

type RemoveMessage = {
  type: "remove";
};

type Message = CursorMessage | RemoveMessage;

export default class CursorServer implements Party.Server {
  cursors: Map<string, Cursor> = new Map();

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    // Send existing cursors to the new connection
    const cursorsObj: Record<string, Cursor> = {};
    this.cursors.forEach((cursor, id) => {
      cursorsObj[id] = cursor;
    });
    conn.send(JSON.stringify({ type: "sync", cursors: cursorsObj }));
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message) as Message;

    if (data.type === "cursor") {
      this.cursors.set(sender.id, data.cursor);
      // Broadcast to all other connections
      this.room.broadcast(
        JSON.stringify({
          type: "update",
          id: sender.id,
          cursor: data.cursor,
        }),
        [sender.id]
      );
    } else if (data.type === "remove") {
      this.cursors.delete(sender.id);
      this.room.broadcast(
        JSON.stringify({
          type: "remove",
          id: sender.id,
        }),
        [sender.id]
      );
    }
  }

  onClose(conn: Party.Connection) {
    this.cursors.delete(conn.id);
    this.room.broadcast(
      JSON.stringify({
        type: "remove",
        id: conn.id,
      })
    );
  }
}

CursorServer satisfies Party.Worker;
