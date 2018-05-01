var AWS = require('aws-sdk');

/* Synthesizes plain text or SSML into a file of human-like speech. */

var polly = new AWS.Polly();

var params = {
  LexiconNames: [
     "example"
  ], 
  OutputFormat: "mp3", 
  SampleRate: "8000", 
  Text: "All Gaul is divided into three parts", 
  TextType: "text", 
  VoiceId: "Tatyana" // Russian
 };

 polly.synthesizeSpeech(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response
   /*
   data = {
    AudioStream: <Binary String>, 
    ContentType: "audio/mpeg", 
    RequestCharacters: 37
   }
   */
 });
//Calling the synthesizeSpeech operation
var params = {
  OutputFormat: json | mp3 | ogg_vorbis | pcm, /* required */
  Text: 'STRING_VALUE', /* required */
  VoiceId: Geraint,
  LexiconNames: [
    'STRING_VALUE',
    /* more items */
  ],
  SampleRate: '',
  SpeechMarkTypes: [
    sentence | ssml | viseme | word,
    /* more items */
  ],
  TextType: ssml | text
};
polly.synthesizeSpeech(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});