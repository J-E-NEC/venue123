import './style.scss'
import heroImg from './assets/hero.png'
import javascriptLogo from './assets/javascript.svg'
import viteLogo from './assets/vite.svg'


// gemini start:




async function askGemini(userPrompt) {
  try {
    const res = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    const data = await res.json();
    
    if (data.error) throw new Error(data.error);

    console.log('Gemini says:', data.text);
    return data.text;
  } catch (err) {
    console.error('Frontend Fetch Error:', err);
  }
}

// Example call
askGemini('Give me a funny one-liner about JavaScript.');

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
