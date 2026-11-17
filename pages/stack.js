import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import s from "../stack.module.css";
import ProfileHomeButton from "../components/ProfileHomeButton";
import { stack } from "../data/stack";

const makers = new Set(["Figma", "Figma Slides", "Claude", "Claude Code", "Zed", "Xcode", "Github", "CleanShot X", "Gifski", "Loom", "Midjourney", "Mobbin", "Mymind"]);
const groups = [
  { name: "Making things", note: "From the first idea to the last pixel.", test: item => makers.has(item.name) },
  { name: "Everyday life", note: "A little order. A little distraction.", test: item => !makers.has(item.name) && item.platforms !== "Physical" },
  { name: "Away from the desk", note: "Things with a place in the real world.", test: item => item.platforms === "Physical" },
];
const colors = ["#d8dfd5", "#e2d5c7", "#d4dce3", "#e7dfc8", "#dcd5e0", "#d0dcd7"];
function Icon({ item }) {
  const sources = [...new Set([item.appIcon, item.logo, item.logoFallback].filter(Boolean))];
  const [index, setIndex] = useState(0);
  return sources[index] ? <img src={sources[index]} alt="" width="56" height="56" loading="lazy" decoding="async" onError={() => setIndex(i => i + 1)} /> : <span aria-hidden="true">{item.name.slice(0, 1)}</span>;
}
function ObjectCover({ item, index = 0 }) {
  const physical = item.platforms === "Physical";
  return <span className={`${s.object} ${physical ? s.photo : s.case}`} style={{ "--cover": colors[index % colors.length] }} aria-hidden="true">
    <span className={s.cover}>
      {physical && item.photo ? <img className={s.personalPhoto} src={item.photo} alt="" loading="lazy" decoding="async" /> : <><span className={s.edition}>{physical ? "PERSONAL COLLECTION" : "DANNY’S SOFTWARE LIBRARY"}</span><span className={s.art}><Icon item={item} /></span><span className={s.coverName}>{item.name}</span></>}
    </span>
    {physical && <span className={s.photoCaption}>{item.name}</span>}
    {!physical && <span className={s.caseEdge} />}
  </span>;
}
export default function StackPage() {
  const [view, setView] = useState("shelf");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    document.body.classList.add("loaded", "stack-page");
    return () => document.body.classList.remove("stack-page");
  }, []);
  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [selected]);
  const close = () => {
    if (dialog.current?.open) dialog.current.close();
    setSelected(null);
    trigger.current?.focus();
  };
  const open = (item, event) => { trigger.current = event.currentTarget; setSelected(item); };
  const items = stack.filter(item => filter === "All" || item.platforms.split(", ").includes(filter));
  return <><Head><title>Tools I Use — Danny Ohana</title><meta name="description" content="A personal shelf of software, objects, and everyday favorites." /></Head>
    <main className={s.page}>
      <header className={s.header}><ProfileHomeButton /><a href="/">Danny Ohana</a><span className={s.headerNote}>The personal collection</span></header>
      <div className={s.scroll}>
        <div className={s.intro}><span className={s.eyebrow}>A FEW GOOD THINGS</span><h1>Tools I Use</h1><p>Software, objects, and other things I’ve developed opinions about.</p></div>
        <div className={s.toolbar}><label className={s.filter}>Show <select value={filter} onChange={e => setFilter(e.target.value)}>{["All", "macOS", "iOS", "Physical"].map(p => <option key={p}>{p}</option>)}</select></label><div className={s.switch} aria-label="View">{["shelf", "list"].map(v => <button type="button" key={v} aria-pressed={view === v} onClick={() => setView(v)}>{v === "shelf" ? "Shelf" : "List"}</button>)}</div></div>
        {view === "shelf" ? <div className={s.collection}>{groups.map(group => {
          const members = items.filter(group.test);
          return members.length > 0 && <section className={s.section} key={group.name}><div className={s.sectionHeading}><h2>{group.name}</h2><span>{group.note}</span></div><div className={s.shelves}>{members.map((item, index) => <div className={s.slot} key={item.name}><button className={s.pick} type="button" onClick={e => open(item, e)} aria-label={`Read about ${item.name}`}><ObjectCover item={item} index={index} /><span className={s.itemLabel}>{item.name}</span></button></div>)}</div></section>;
        })}</div> : <div className={s.list}><table><thead><tr><th scope="col">Tool</th><th scope="col">My take</th><th scope="col">Platform</th></tr></thead><tbody>{[...items].sort((a,b) => a.name.localeCompare(b.name)).map(item => <tr key={item.name}><th scope="row"><button onClick={e => open(item, e)}><Icon item={item} /><span>{item.name}</span></button></th><td>{item.description}</td><td>{item.platforms}</td></tr>)}</tbody></table></div>}
        <footer className={s.footer}>Collected with care. Subject to changing my mind.</footer>
      </div>
      <dialog ref={dialog} className={s.dialog} aria-labelledby="tool-title" onCancel={e => { e.preventDefault(); close(); }} onClose={() => { setSelected(null); trigger.current?.focus(); }} onClick={e => { if (e.target === e.currentTarget) close(); }}>
        {selected && <div className={s.detail}><button className={s.close} onClick={close} aria-label="Close tool details" autoFocus>×</button><div className={s.detailObject}><ObjectCover item={selected} /></div><span className={s.eyebrow}>{selected.platforms}</span><h2 id="tool-title">{selected.name}</h2><p>{selected.description}</p>{selected.url && <a href={selected.url} target="_blank" rel="noopener noreferrer">Visit website ↗</a>}</div>}
      </dialog>
    </main></>;
}
