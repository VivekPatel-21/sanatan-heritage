# Ambaji homepage media

## Current edit — 24 October 2026

The owner requested that the shrine remain centered throughout playback on mobile, tablet and desktop. The original 17-second clip moves so close to the right source edge in its final seconds that centering it requires extreme enlargement of an already cropped building. The homepage now uses the clean first 12 seconds as a silent loop. The full prior rendition remains in Git history; no image detail is generated or reconstructed.

Delivery: 1920×1080 desktop H.264 (about 5.35 MB), 1280×720 mobile/tablet H.264 (about 2.45 MB), CRF25/26, faststart, no audio. Both preserve the same uncropped source coordinates. `home-museum.js` tracks the measured golden-shikhara centre using interpolated keyframes and per-video-frame updates (timeupdate fallback). Container geometry determines scale and translation for each aspect ratio, keeping the tracked centre in the middle without exposing empty edges. The motion naturally resets with the loop. `design-assets/video-focus.json` records the inspected source trajectory; the homepage only plays its first 12 seconds.

Preload remains none; poster, reduced-motion/data-saving preferences, manual pause and offscreen behavior remain available. The local preview server now supports byte-range video delivery for efficient seeking.

## Earlier rendition (superseded)

Source: owner-supplied `Ambaji mandir Chat 16 sec.realesrgan.mkv` (Library libfile_44a033c9a13c8191accfde6c5e9bfc84), 7680×4320 H.264, 30fps, ~16.743 seconds. Filename identifies owner-supplied Real-ESRGAN enhancement; do not describe it as native 8K camera footage.

Full clip retained. Desktop: 3840×2160 MP4, H.264 CRF23, maxrate8M/bufsize16M, yuv420p, faststart. Mobile/tablet <=1000px: 1080×1350 MP4, CRF23 maxrate2500k/bufsize5M. Crop source to 3456×4320 at y=0, x=2600+max(0,t-5)*125 to follow the temple as it moves right. Same footage, responsive renditions for one placement. Both silent, no audio track. Poster is first frame resized to 1600×900. Original upload untouched.

Existing muted loop, pause/play, offscreen behavior, reduced-motion and data-saving preferences retained. Previous 8-second footage superseded. Night clip remains unused.
