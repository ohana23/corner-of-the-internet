# Mobile carousel audit

Viewport: 390 × 844 px. Scope: the three Selected Work carousels and the media viewer on the front page.

## Overall verdict

The galleries look polished once a user advances or opens an item, but on mobile they initially read as static hero images. The 28 px arrow controls are difficult to notice and undersized for touch, the gallery gives no count or progress, and free scrolling can stop between items because the track has no scroll snapping.

## Evidence

1. `02-procore-initial.png` — Initial Procore gallery. Health: needs improvement. One full-width image is visible with no next-item peek, count, or swipe cue.
2. `03-procore-next.png` — Gallery after using the next arrow. Health: mostly healthy. The selected item is well centered and the transition preserves image scale, but the only state feedback is the image itself.
3. `04-procore-partial-swipe.png` — Gallery after a partial horizontal scroll. Health: poor. The track can rest between cards, leaving two cropped images and an accidental-looking composition.
4. `05-media-viewer.png` — Media viewer opened from a gallery. Health: healthy. The image, counter, close action, and bottom navigation are clear; however, the global `2/25` count does not explain which company group the user is browsing.

## Highest-impact improvements

1. Add `scroll-snap-type: x mandatory` to the track and `scroll-snap-align: center` to each media item.
2. Increase arrow hit areas from 28 px to at least 44 × 44 px, while keeping the glyph visually light.
3. Add a compact per-company indicator such as `1 / 11` beside the controls and update it after button or touch scrolling.
4. Make overflow discoverable on the initial card: show a small 12–20 px peek of the next item, or add a short one-time “Swipe” hint.
5. Disable or hide Previous on the first item and Next on the last item, and expose the disabled state semantically.
6. Keep the current lightbox; optionally scope its count to the active company or label the global collection more clearly.

## Accessibility limits

Screenshots confirm visual size, hierarchy, and responsive reflow risks. Keyboard focus styling and button labels are present in the implementation, but screen-reader announcements, touch behavior on physical devices, contrast ratios, zoom resilience, and reduced-motion behavior still need device or assistive-technology testing.
