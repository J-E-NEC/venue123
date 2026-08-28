import './style.scss'

document.querySelector('#app').innerHTML = `

<section id="intro">
  <h1>Venue AI Test</h1>
</section>

<div class="ticks"></div>

<section id="output">
  <div class="chat-bubble ai-bubble">
    <div class="ai-explanation">
      <p>Tell me about the event you want to host...</p>
    </div>
  </div>
  <!-- The results will magically appear here -->
</section>

<div class="ticks" style="margin-top: auto;"></div>

<section id="question">
  <textarea id="VenueAiQuery" class="lvp-js-venue-ai-query" type="text" autocomplete="off" placeholder="Message" required="required" data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" /></textarea>
  <button type="submit" id="VenueAiQuerySubmit">GO</button>
</section>


<section id="spacer" style="display: none;"></section>
`


// gemini start:

let chatHistory = [];

const inputField = document.getElementById('VenueAiQuery');
const submitButton = document.getElementById('VenueAiQuerySubmit');
const outputSection = document.getElementById('output');

// --- NEW UI HELPER FUNCTIONS ---

function appendUserMessage(text) {
  const html = `<div class="chat-bubble user-bubble"><p>${text}</p></div>`;
  // append just this bubble to the bottom!
  outputSection.insertAdjacentHTML('beforeend', html); 
  scrollToBottom();
}

function showSkeletonLoader() {
  // Give it an ID so we can find it and delete it later
  const html = `
    <div class="chat-bubble ai-bubble skeleton" id="active-loader">
      <span>Thinking...</span>
      <span>Refining...</span>
      <span>Contemplating...</span>
      <span>Deliberating...</span>
      <span>Pondering...</span>
      <span>Reflecting...</span>
      <span>Parambulating...</span>
      <span>Analysing...</span>
      <span>Narrowing...</span>
      <span>Closing in...</span>
    </div>
  `;
  // if you change the number of items make sure to update the scss
  outputSection.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

function removeSkeletonLoader() {
  const loader = document.getElementById('active-loader');
  if (loader) loader.remove();
}

function appendAIMessage(data) {
  let html = `<div class="chat-bubble ai-bubble"><div class="ai-explanation"><p>${data.explanation}</p></div>`;

  if (data.matchingVenues && data.matchingVenues.length > 0) {
    html += `<div class="venue-list">`;
    data.matchingVenues.forEach(venue => {
      html += `
        <div class="venue-result" id="${venue.venueId}">
          <div class="venue-name">
            ${venue.venueName}
          </div>
          -
          <div class="space-name">
            ${venue.spaceName}
          </div>
           -
          <div class="venue-location">
            ${venue.location}
          </div>
           -
          <div class="venue-capacity">
            Capacity: ${venue.seatingCapacity}
          </div>
           
          <div class="venue-description">
            ${venue.description}
          </div>

          <a href="${venue.venueUrl}" target="_blank" class="invert">View Venue</a>
          <a href="https://www.thenec.co.uk/contact-us/" target="_blank">Get In Touch</a>
        </div>
      `;
    });
    html += `</div>`;
  } else {
    html += `<p>Sorry darling, I couldn't find any spaces that fit that description.</p>`;
  }
  
  html += `</div>`; // Close the bubble
  outputSection.insertAdjacentHTML('beforeend', html);
  scrollToBottom();
}

function scrollToBottom() {
  // Makes sure the chat window always scrolls down to the newest message
  outputSection.scrollTop = outputSection.scrollHeight; 
}


// --- THE MAIN SEARCH FUNCTION ---

async function searchVenues(userQuery) {
  appendUserMessage(userQuery); // 1. Show user message
  inputField.value = '';        // 2. Clear the box instantly for good UX
  showSkeletonLoader();         // 3. Show the snazzy shimmer

  chatHistory.push({ role: 'user', parts: [{ text: userQuery }] });

  try {
    const res = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationHistory: chatHistory })
    });
    
    if (!res.ok) throw new Error("Server threw a wobbly!");

    const data = await res.json();
    chatHistory.push({ role: 'model', parts: [{ text: JSON.stringify(data) }] });

    removeSkeletonLoader(); // 4. Remove the loader
    appendAIMessage(data);  // 5. Inject the real data!

  } catch (err) {
    console.error("Error:", err);
    removeSkeletonLoader();
    outputSection.insertAdjacentHTML('beforeend', `<div class="chat-bubble ai-bubble"><p style="color: red;">Oh dear, something went wrong fetching the venues!</p></div>`);
    scrollToBottom();
  }
}

// --- EVENT LISTENERS ---

submitButton.addEventListener('click', () => {
  const query = inputField.value.trim();
  if (query) searchVenues(query);
});

inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = inputField.value.trim();
    if (query) searchVenues(query);
  }
});

// gemini end