import './style.scss'
import heroImg from './assets/hero.png'
import javascriptLogo from './assets/javascript.svg'
import viteLogo from './assets/vite.svg'


// gemini start:

// 1. Create your memory bank globally in your component/script
let chatHistory = [];

async function searchVenues(userQuery) {
  // 2. Log the user's new question into the history
  chatHistory.push({
    role: 'user',
    parts: [{ text: userQuery }]
  });

  try {
    // 3. Send the entire diary to Netlify
    const res = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationHistory: chatHistory })
    });
    
    const data = await res.json();
    
    // 4. Log the AI's response back into the history so it remembers for next time!
    chatHistory.push({
      role: 'model',
      // We stringify the JSON object because Gemini needs it as text memory
      parts: [{ text: JSON.stringify(data) }] 
    });

    // 5. Update your UI!
    console.log("Explanation:", data.explanation);
    console.log("Venues to show:", data.matchingVenues);

  } catch (err) {
    console.error("Oh no, a wobbly!", err);
  }
}

// Example flow:
await searchVenues("I want a 500 person venue in the west midlands");
// await searchVenues("Actually, can you make sure it's in the city centre?");

// gemini end

document.querySelector('#app').innerHTML = `

<div class="ticks"></div>

<section id="intro">
  <h1>
    Venue AI Test
  </h1>
</section>

<div class="ticks"></div>


<section id="question">
  <textarea id="VenueAiQuery" class="lvp-js-venue-ai-query" type="search" name="query" autocomplete="off" rows="1" placeholder="Tell Jack about the event you want to host..." required="required"></textarea>
  <button type="submit" id="VenueAiQuerySubmit">GO</button>
</section>

<div class="ticks"></div>

<section id="output">

</section>

<div class="ticks"></div>


<section id="next-steps">
  <div id="docs">
  </div>
  <div id="social">
    
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`
