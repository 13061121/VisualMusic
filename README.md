VisualMusic
===========

HTML5 music visualization (Chrome only)

Download the files directly or visit the page online [here](https://13061121.github.io/VisualMusic/).

## Requirements
- Use [JQuery](https://github.com/jquery/jquery) for more easily coding.
- Use [Requirejs](https://github.com/requirejs/requirejs) to manage js files.
- Use [Three.js](https://github.com/mrdoob/three.js) to draw 3d effects.
- Use [Jsmediatags](https://github.com/aadsm/jsmediatags) to resolve music files.


##How to use it

- Drag the files into the browser or click the center to play the music.
- Right click to open the song list panel.
- Use arrow key **Left** and **Right** to switch visual effect.
- Use arrow key **Up** and **Down** to play the last song or next song.

##Create your own visual effect

- Copy the **template.js** inside js folder, and change it to whatever name you like.
- Include the file in **effect.js**, the typical requirejs thing.
- Start writing your own effect inside the file you just copied.