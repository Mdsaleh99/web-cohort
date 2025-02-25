/*

Problem statement
Create a Playlist constructor that initializes with an empty songs array. Add a method addSong(song) to the prototype that adds a new song to the playlist.

Challenge
Implement a constructor function Playlist that initializes an empty songs array.
Attach a method addSong(song) to its prototype that adds the song to the songs array.

*/

function Playlist() {
  // Initialize songs property
  let songs = [];
  this.songs = songs;
}

// Define addSong method on Playlist's prototype
Playlist.prototype.addSong = function (song) {
  return this.songs.push(song);
};