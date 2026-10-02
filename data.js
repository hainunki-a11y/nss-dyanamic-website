/* ============================================================
   NSS TSEC — Shared Data Loader (data.js)
   - fetch()es the /data JSON files with a small cache + timeout
   - Exposes a promise-based API: window.NSS.getData()
   - Embeds an offline / last-known-good fallback snapshot
   - Provides NSS.escapeHtml() for XSS-safe text rendering
   Load BEFORE any page renderer (Session 3) so renderers await data.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Embedded offline fallback snapshot ----------
     Last-known-good defaults. If any fetch() fails or times out,
     the site renders from this snapshot so it never looks broken.
     Regenerated on each deploy. */
  var FALLBACK = JSON.parse(`{"site":{"hero":{"title":"TSEC-NSS UNIT","quote":"NOT ME BUT YOU"},"about":{"title":"ABOUT NSS","paragraphs":["The National Service Scheme (NSS), a flagship programme of the Department of Youth Affairs and Sports, Government of India, operates in collaboration with the University of Mumbai. Anchored in its inspiring motto “Not Me, But You,” NSS reflects the values of democratic citizenship and altruistic service, striving to cultivate responsible, empathetic, and socially conscious youth.","At Thakur Shyamnarayan Engineering College (TSEC), the NSS Unit was inaugurated on 21st June 2025 with an enthusiastic strength of 100 volunteers. The unit is devoted to nurturing socially responsible leaders who contribute actively to the community."]},"objectives":{"title":"Our Objectives","intro":"The focus is on enhancing the quality of educated manpower through the cultivation of social responsibility. This entails elevating both material and moral aspects of society by preparing students for dedicated service to the nation. By immersing urban students in rural life, they gain first hand exposure to the community around their institution. The objective is to make the campus responsive to community needs, establishing a constructive link between technical education and the social and economic reconstruction of the country. This involvement contributes to national development and fosters a deeper understanding and appreciation of societal issues, encouraging active community participation."},"contact":{"college":"TSEC","address":"Mumbai, Kandivali East","collegeUrl":"https://tsecmumbai.in/","email":"nss@tsecmumbai.in","phoneLines":[{"label":"Dr. Suresh Pathak (PO)","phone":"9869525639"},{"label":"Bhavesh Chaudhary (Youth President)","phone":"7756828367"},{"label":"Aditi Singh (Youth President)","phone":"9082070174"},{"label":"Siddhant Bhandari (Tech Head)","phone":"9260003000"}],"mapEmbedUrl":"https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3767.5737281905663!2d72.86493!3d19.213812!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b75d78c4f78d%3A0xda99279267c50407!2sThakur%20Shyamnarayan%20Engineering%20College!5e0!3m2!1sen!2sin!4v1775224237084!5m2!1sen!2sin","mapLink":"https://maps.app.goo.gl/1cJSEkku6nCB3DFB7","copyright":"2026 NSS TSEC Mumbai","tagline":"Not Me, But You."},"introText":{"line1":"TSEC NSS UNIT","line2":"MH09SB39"}},"heroSlides":{"slides":[{"image":"assets/photos/hero_1.jpg","alt":"Hero 1","order":1},{"image":"assets/photos/hero_2.jpg","alt":"Hero 2","order":2},{"image":"assets/photos/hero_3.png","alt":"Hero 3","order":3},{"image":"assets/photos/hero_4.jpg","alt":"Hero 4","order":4},{"image":"assets/photos/hero_5.jpg","alt":"Hero 5","order":5}]},"objectives":{"items":[{"image":"assets/photos/hero_1.jpg","title":"Community Understanding","description":"Develop awareness about real-world community challenges","order":1},{"image":"assets/photos/hero_2.jpg","title":"Assessment & Engagement","description":"Actively participate and analyze social needs","order":2},{"image":"assets/photos/hero_3.png","title":"Competence Development","description":"Build skills through practical social work experiences","order":3},{"image":"assets/photos/hero_4.jpg","title":"Leadership & Democracy","description":"Encourage leadership and democratic values among youth","order":4}]},"categoryIcons":{"icons":{"hackathon":"💻","health drive":"❤️","cultural event":"🎭","awareness":"📢","seminar":"🎓","event series":"🗓️","patriotic event":"🇮🇳","sports":"🏅","environment":"🌱","rally":"📣","ceremony":"🏆","celebration":"🎉","orientation":"🎯"}},"magazine":{"cover":{"image":"assets/photos/hero_1.jpg","logo":"assets/nss_logo.png","title":"NSS MAGAZINE"},"foreword":"Welcome to the inaugural edition of our NSS Magazine. This visual journey captures the heart and soul of our unit's impact on community and nation.","pages":[{"front":{"image":"assets/photos/hero_1.jpg","title":"Beach Cleaning Drive","description":"Our volunteers gathered at Juhu Beach for a massive cleaning drive, collecting over 200 kg of waste. The event brought together 80+ enthusiastic members who worked tirelessly under the morning sun."},"back":{"image":"assets/photos/hero_2.jpg","title":"Independence Day Rally","description":"A grand rally through the streets of Bandra on 15th August filled the neighbourhood with patriotic fervour. Volunteers carried the national flag and sang anthems."},"order":1},{"front":{"image":"assets/photos/hero_3.png","title":"NSS Day Celebrations","description":"Celebrating NSS Day with cultural programmes, tree plantation, and a pledge ceremony. Faculty advisors addressed the gathering, inspiring volunteers."},"back":{"image":"assets/photos/hero_4.jpg","title":"Blood Donation Camp","description":"In collaboration with local hospitals, our NSS unit organized a blood donation camp on campus. Over 60 units were collected in a single day."},"order":2}]},"teamMembers":{"sections":{"faculty":[{"name":"Dr. S.M. Ganechari.","role":"Principal & Chief Advisor","photo":"assets/photos/pricipal.png.png","quote":"NSS shapes our students into responsible, compassionate citizens through selfless service and real-world learning.","order":1},{"name":"DR.Suresh Pathak","role":"Programme Officer","photo":"assets/photos/po.png.png","quote":"I see NSS as a platform where students turn their energy into meaningful social impact while growing as leaders.","order":2},{"name":"Dr. Nirmala Kamble","role":"Programme Officer","photo":"https://placehold.co/400x500","quote":"NSS encourages students to serve society with dedication and compassion.","order":3},{"name":"Ajay Chawda","role":"Faculty","photo":"https://placehold.co/400x500","quote":"Ajay Chawda","order":4},{"name":"Alok Pandey","role":"Faculty","photo":"https://placehold.co/400x500","quote":"Alok Pandey","order":5},{"name":"Naman Taneja","role":"Faculty","photo":"https://placehold.co/400x500","quote":"Naman Taneja","order":6},{"name":"Vandana Prabhu","role":"Faculty","photo":"https://placehold.co/400x500","quote":"Vandana Prabhu","order":7},{"name":"Kavita Dhiwar","role":"Faculty","photo":"https://placehold.co/400x500","quote":"Kavita Dhiwar","order":8}],"leadership":[{"name":"Bhavesh Chaudhary","role":"Youth President","photo":"https://placehold.co/400x500","quote":"taking initiative and empowering my team.","order":1},{"name":"Aditi Singh","role":"Youth President","photo":"https://placehold.co/400x500","quote":"Driven","order":2},{"name":"Siddhant Bhandari","role":"Technical Head","photo":"https://placehold.co/400x500","quote":"Innovative","order":3},{"name":"Adarsh Panday","role":"Event Management Head","photo":"https://placehold.co/400x500","quote":"Proactive","order":4},{"name":"Kartik Gupta","role":"Asst. Technical Head","photo":"https://placehold.co/400x500","quote":"Determined","order":5}],"council":[{"name":"Devkar Susmita","role":"PR & Team Lead","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":1},{"name":"Samiksha Singh","role":"Team Leader","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":2},{"name":"Samiksha Shetty","role":"PR & Representative","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":3},{"name":"Vaibhavi Mathpati","role":"Creative Member","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":4},{"name":"Shomya Shukla","role":"Attendance & Records Manager","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":5},{"name":"Om Jalela","role":"Cinematography Head","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":6},{"name":"Ansh Jaiswal","role":"Asst. Event Manager","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":7},{"name":"Dhruvika Survase","role":"Committee Executive","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":8},{"name":"Trilok Bhatt","role":"Media Cell Manager","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":9},{"name":"Yash Patne","role":"Technical Member","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":10},{"name":"Taniksha Komule","role":"Creative Team","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":11},{"name":"Taniksha Pokhriyal","role":"Team Lead","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":12},{"name":"Jayani Salongkar","role":"Creative & Design","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":13},{"name":"Shraddha Ghadge","role":"Team Lead & Discipline Incharge","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":14},{"name":"Rahul Soni","role":"Technical Manager","photo":"https://placehold.co/400x500","quote":"NSS TSEC","order":15}],"committee":[{"name":"Bhavesh Chaudhary","designation":"NSS Leader","order":1},{"name":"Aditi Singh","designation":"NSS Leader","order":2},{"name":"Siddhant Bhandari","designation":"Technical Head","order":3},{"name":"Kartik Gupta","designation":"Asst. Technical Head","order":4},{"name":"Adarsh Panday","designation":"Event Management Head","order":5},{"name":"Devkar Susmita","designation":"PR & Team Lead","order":6},{"name":"Samiksha Singh","designation":"Team Lead","order":7},{"name":"Samiksha Shetty","designation":"PR & Representative","order":8},{"name":"Vaibhavi Mathpati","designation":"Documentation Manager","order":9},{"name":"Shomya Shukla","designation":"Attendance & Records Manager","order":10},{"name":"Om Jalela","designation":"Cinematography Head","order":11},{"name":"Ansh Jaiswal","designation":"Asst. Event Manager","order":12},{"name":"Dhruvika Survase","designation":"Committee Executive","order":13},{"name":"Trilok Bhatt","designation":"Media Cell Manager","order":14},{"name":"Yash Patne","designation":"Technical Member","order":15},{"name":"Taniksha Komule","designation":"Content Manager","order":16},{"name":"Taniksha Pokhriyal","designation":"Team Lead","order":17},{"name":"Jayani Salongkar","designation":"Creative & Design","order":18},{"name":"Shraddha Ghadge","designation":"Team Lead & Discipline Incharge","order":19},{"name":"Rahul Soni","designation":"Technical Manager","order":20}]}},"testimonials":{"items":[{"name":"Tirtha Pawar","role":"Volunteer","year":"Batch 2025-26","thought":"\\"My one year journey in NSS has been a truly memorable and enriching experience. During this time, I actively participated in a 7-day special camp, where we conducted social awareness rallies and community service activities. I also took part in the 15th August rally around the local area, beach cleanliness drives, and tree plantation programs. These activities helped me develop teamwork and a strong sense of social responsibility. Overall, my NSS journey inspired me to contribute positively to society and become a more responsible citizen.\\"","avatar":"assets/testimonials/tirtha.png","order":1},{"name":"Mr. Nitin Gupta","role":"Volunteer","year":"Batch 2025-26","thought":"\\"I am Mr. Nitin Gupta from the Electronics and Computer Engineering branch. When I first decided to join the National Service Scheme (NSS), I had very little idea of what it truly meant to serve society and the nation. I thought it was just another college activity, but my perspective changed completely after becoming a volunteer. NSS taught me that real service begins with small acts of kindness and responsibility. Through various social initiatives, awareness drives, and community activities, I learned the importance of teamwork, leadership, and empathy. Every event helped me grow as a better individual and strengthened my confidence. I realized that serving the nation is not only about grand gestures but also about making a positive impact in people's lives. The experiences and memories I gained through NSS have shaped my personality in countless ways. Joining NSS has been one of the most meaningful decisions of my college life, and I will always be grateful for this journey.\\"","avatar":"assets/testimonials/Nitin.png","order":2},{"name":"Aryan Singh","role":"Mechanical Engineering","year":"NSS Volunteer | Batch 2025-26","thought":"\\"I’m from the Mechanical Engineering Department and was an NSS Volunteer from Batch 2025-26. Working with NSS has truly helped me gain leadership, teamwork, public speaking, and volunteering skills. Additionally, it helped me understand people and their perspectives.\\"","avatar":"assets/testimonials/Aryan.png","order":3},{"name":"Rohan Gupta","role":"Volunteer","year":"Class of 2025","thought":"\\"From beach cleaning to blood donation drives, each event pushed me to be a better version of myself for the society.\\"","avatar":"https://placehold.co/150x150","order":4},{"name":"Ananya Singhania","role":"Vice President","year":"Class of 2024","thought":"\\"NSS is where I found my purpose. The smiles on the faces of people we help are the biggest rewards I've ever received.\\"","avatar":"https://placehold.co/150x150","order":5},{"name":"Siddharth Mehta","role":"Volunteer","year":"Class of 2026","thought":"\\"Being a new member, the warmth of the seniors and the impact of the programmes have been truly inspiring and motivating.\\"","avatar":"https://placehold.co/150x150","order":6},{"name":"Kritika Verma","role":"Co-ordinator","year":"Class of 2025","thought":"\\"Organizing the Hackspark event was a challenge, but seeing its success made me value teamwork and perseverance above all.\\"","avatar":"https://placehold.co/150x150","order":7}]},"events":{"2025-26":[{"title":"150 Years Grand Vande Mataram Singing","date":"07 Nov 2025","tag":"Patriotic Event","photo":"assets/Events/150 years grand vande mataram.jpeg","order":20},{"title":"AAROHAN","date":"31 Jan 2026","tag":"Cultural Event","photo":"https://placehold.co/800x600","order":4},{"title":"AAROHAN","date":"30 Jan 2026","tag":"Cultural Event","photo":"https://placehold.co/800x600","order":5},{"title":"AAROHAN","date":"29 Jan 2026","tag":"Cultural Event","photo":"https://placehold.co/800x600","order":8},{"title":"Aventura","date":"17 Jan 2026","tag":"Event Series","photo":"https://placehold.co/800x600","order":10},{"title":"Aventura","date":"15 Jan 2026","tag":"Event Series","photo":"https://placehold.co/800x600","order":11},{"title":"Aventura","date":"14 Jan 2026","tag":"Event Series","photo":"https://placehold.co/800x600","order":12},{"title":"Aventura","date":"13 Jan 2026","tag":"Event Series","photo":"https://placehold.co/800x600","order":13},{"title":"Aventura","date":"12 Jan 2026","tag":"Event Series","photo":"https://placehold.co/800x600","order":14},{"title":"Awareness On Street Dogs","date":"19 Dec 2025","tag":"Awareness","photo":"https://placehold.co/800x600","order":18},{"title":"Beach Cleaning Drive","date":"20 Sep 2025","tag":"Environment","photo":"assets/Events/BEach cleaning drive.jpeg","order":27},{"title":"Blood Donation Camp","date":"06 Feb 2026","tag":"Health Drive","photo":"https://placehold.co/800x600","order":3},{"title":"CPR Training","date":"11 Jul 2025","tag":"Health Drive","photo":"https://placehold.co/800x600","order":36},{"title":"Day 1 Hackspark's 2.0","date":"20 Feb 2026","tag":"Hackathon","photo":"https://placehold.co/600x800","order":2},{"title":"Day 2 Hackspark's 2.0","date":"21 Feb 2026","tag":"Hackathon","photo":"https://placehold.co/600x800","order":1},{"title":"FE Orientation","date":"16 Sep 2025","tag":"Orientation","photo":"assets/Events/nss-orientation.jpg","order":28},{"title":"FE SSC Awareness Program","date":"29 Jan 2026","tag":"Awareness","photo":"https://placehold.co/800x600","order":7},{"title":"Flag Hoisting","date":"15 Aug 2025","tag":"Patriotic Event","photo":"assets/Events/Independence day.jpeg","order":33},{"title":"Ganpati Visarjan 5 Day","date":"31 Aug 2025","tag":"Cultural Event","photo":"assets/Events/Ganapati day 5.jpeg","order":31},{"title":"Ganpati Visarjan 7 Day","date":"02 Sep 2025","tag":"Cultural Event","photo":"assets/Events/Ganpati Visarjan day 7.jpeg","order":30},{"title":"Health Checkup Camp","date":"11 Jul 2025","tag":"Health Drive","photo":"assets/Events/health-checkup.jpg","order":37},{"title":"Medical Checkup Camp","date":"30 Jan 2026","tag":"Health Drive","photo":"assets/Events/health-checkup.jpg","order":6},{"title":"NSS Day","date":"24 Sep 2025","tag":"Celebration","photo":"assets/Events/NSS Day.jpeg","order":26},{"title":"Oath Ceremony","date":"25 Sep 2025","tag":"Ceremony","photo":"https://placehold.co/800x600","order":25},{"title":"Pledge on National Unity Day","date":"30 Oct 2025","tag":"Patriotic Event","photo":"assets/Events/Unity Day.jpeg","order":21},{"title":"Prarambh Sports Day","date":"17 Oct 2025","tag":"Sports","photo":"https://placehold.co/800x600","order":22},{"title":"Reforming the Justice System","date":"19 Nov 2025","tag":"Seminar","photo":"https://placehold.co/800x600","order":19},{"title":"Seminar on Communication Skills","date":"25 Aug 2025","tag":"Seminar","photo":"https://placehold.co/800x600","order":32},{"title":"Seminar on NPTEL","date":"21 Jul 2025","tag":"Seminar","photo":"https://placehold.co/800x600","order":35},{"title":"Seminar on Preparing Engineers for Industry Expectations","date":"29 Jul 2025","tag":"Seminar","photo":"https://placehold.co/800x600","order":34},{"title":"Smart India Hackathon","date":"26 Sep 2025","tag":"Hackathon","photo":"https://placehold.co/600x800","order":24},{"title":"Teachers Day","date":"05 Sep 2025","tag":"Celebration","photo":"https://placehold.co/800x600","order":29},{"title":"TPC Guide on Future Seminar","date":"28 Jan 2026","tag":"Seminar","photo":"https://placehold.co/800x600","order":9},{"title":"Tree Plantation Drive","date":"03 Oct 2025","tag":"Environment","photo":"assets/Events/tree plantation.jpg","order":23},{"title":"Voting Awareness","date":"05 Jan 2026","tag":"Awareness","photo":"https://placehold.co/800x600","order":16},{"title":"Women Health Awareness","date":"07 Jan 2026","tag":"Awareness","photo":"https://placehold.co/800x600","order":15},{"title":"Youth Mental Health & Suicide Prevention Awareness","date":"22 Dec 2025","tag":"Awareness","photo":"https://placehold.co/800x600","order":17}],"2026-27":[{"title":"Beach Cleaning Gorai","date":"27 Sep 2026","tag":"Environment","venue":"Gorai","photo":"assets/Events/beach-cleaning.jpeg","order":1},{"title":"Ganpati Visarjan","date":"15 Sep 2026","tag":"Cultural Event","venue":"Mumbai","photo":"assets/Events/ganpati vishrajan.jpg","order":5},{"title":"Ganpati Visarjan","date":"18 Sep 2026","tag":"Cultural Event","venue":"Mumbai","photo":"assets/Events/ganpati vishrajan.jpg","order":4},{"title":"Health Checkup Camp","date":"14 Aug 2026","tag":"Health Drive","venue":"TSEC","photo":"assets/Events/health-checkup.jpg","order":8},{"title":"Helping Traffic Management in Visarjan","date":"25 Sep 2026","tag":"Social Service","venue":"Mumbai","photo":"assets/Events/traffic management ganpati vishrajan.jpg","order":2},{"title":"Independence Day","date":"15 Aug 2026","tag":"Patriotic Event","venue":"TSEC","photo":"assets/Events/independence day.jpg","order":7},{"title":"International Yoga Day","date":"21 Jun 2026","tag":"Health Drive","venue":"TSEC","photo":"assets/Events/international-yoga day.jpg","order":14},{"title":"Kargil Diwas Celebration","date":"24 Jul 2026","tag":"Patriotic Event","venue":"TSEC","photo":"assets/Events/Kargil Diwas.jpg","order":13},{"title":"Karuna","date":"24 Sep 2026","tag":"Celebration","venue":"TSEC","photo":"assets/Events/Karuna 2026.jpg","order":3},{"title":"Nasha Mukti Awareness","date":"30 Jul 2026","tag":"Awareness","venue":"TSEC","photo":"assets/Events/nasha-mukti.jpg","order":12},{"title":"NSS Orientation","date":"31 Jul 2026","tag":"Orientation","venue":"TSEC","photo":"assets/Events/nss-orientation.jpg","order":11},{"title":"SGNP Awareness Program","date":"08 Aug 2026","tag":"Awareness","venue":"Sanjay Gandhi National Park","photo":"assets/Events/sgnp awareness.jpg","order":10},{"title":"SGNP Kanheri Caves Visit","date":"25 Aug 2026","tag":"Environment","venue":"Sanjay Gandhi National Park","photo":"assets/Events/kanheri caves.jpg","order":6},{"title":"Tree Plantation Drive","date":"12 Aug 2026","tag":"Environment","venue":"Borivali West","photo":"assets/Events/tree plantation.jpg","order":9}]},"eventsManifest":{"2025-26":["150-years-grand-vande-mataram-singing20.json","aarohan4.json","aarohan5.json","aarohan8.json","aventura10.json","aventura11.json","aventura12.json","aventura13.json","aventura14.json","awareness-on-street-dogs18.json","beach-cleaning-drive27.json","blood-donation-camp3.json","cpr-training36.json","day-1-hackspark-s-2-02.json","day-2-hackspark-s-2-01.json","fe-orientation28.json","fe-ssc-awareness-program7.json","flag-hoisting33.json","ganpati-visarjan-5-day31.json","ganpati-visarjan-7-day30.json","health-checkup-camp37.json","medical-checkup-camp6.json","nss-day26.json","oath-ceremony25.json","pledge-on-national-unity-day21.json","prarambh-sports-day22.json","reforming-the-justice-system19.json","seminar-on-communication-skills32.json","seminar-on-nptel35.json","seminar-on-preparing-engineers-for-industry-expectations34.json","smart-india-hackathon24.json","teachers-day29.json","tpc-guide-on-future-seminar9.json","tree-plantation-drive23.json","voting-awareness16.json","women-health-awareness15.json","youth-mental-health-suicide-prevention-awareness17.json"],"2026-27":["beach-cleaning-gorai.json","ganpati-visarjan-15.json","ganpati-visarjan-18.json","health-checkup-camp.json","helping-traffic-management-in-visarjan.json","independence-day.json","international-yoga-day.json","kargil-diwas-celebration.json","karuna.json","nasha-mukti-awareness.json","nss-orientation.json","sgnp-awareness-program.json","sgnp-kanheri-caves-visit.json","tree-plantation-drive.json"]}}`);

  /* ---------- 2. Per-URL fetch cache (promise dedup) ---------- */
  var promiseCache = {};

  /* ---------- 3. Fetch a single JSON file with timeout ---------- */
  function fetchJSON(url, timeoutMs) {
    if (promiseCache[url]) return promiseCache[url];

    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = null;
    if (controller && typeof setTimeout === 'function') {
      timer = setTimeout(function () { controller.abort(); }, timeoutMs || 5000);
    }

    promiseCache[url] = fetch(url, controller ? { signal: controller.signal } : {})
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
        return res.json();
      })
      .catch(function (err) {
        console.error('[NSS data] fetch failed: ' + url, err);
        return null;
      })
      .then(function (val) {
        if (timer) clearTimeout(timer);
        return val;
      });

    return promiseCache[url];
  }

  /* ---------- 4. XSS-safe HTML escaping ---------- */
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------- 5. Load every JSON file ---------- */
  function loadAll() {
    var base = 'data';
    var singleFiles = {
      site: 'site.json',
      heroSlides: 'hero-slides.json',
      objectives: 'objectives.json',
      categoryIcons: 'category-icons.json',
      magazine: 'magazine.json',
      teamMembers: 'team-members.json',
      testimonials: 'testimonials.json'
    };
    var singleKeys = Object.keys(singleFiles);

    var singleTasks = singleKeys.map(function (key) {
      return fetchJSON(base + '/' + singleFiles[key]);
    });

    var events = {};
    var years = (FALLBACK.eventsManifest) ? Object.keys(FALLBACK.eventsManifest) : [];
    var eventTasks = years.map(function (year) {
      var files = (FALLBACK.eventsManifest && FALLBACK.eventsManifest[year]) || [];
      return Promise.all(files.map(function (f) {
        return fetchJSON(base + '/events/' + year + '/' + f);
      })).then(function (list) {
        events[year] = list.filter(Boolean);
      });
    });

    return Promise.all(singleTasks.concat(eventTasks)).then(function (results) {
      var data = {};
      singleKeys.forEach(function (key, i) { data[key] = results[i]; });
      data.events = events;
      return data;
    });
  }

  /* ---------- 6. Public promise-based API ---------- */
  var dataCache = null;

  function getData() {
    if (dataCache) return Promise.resolve(dataCache);

    return loadAll()
      .then(function (data) {
        Object.keys(FALLBACK).forEach(function (k) {
          if (k === 'eventsManifest') return;
          if (data[k] == null) {
            data[k] = FALLBACK[k];
          } else if (k === 'events') {
            Object.keys(FALLBACK.events || {}).forEach(function (y) {
              if (!data[k][y] || !data[k][y].length) data[k][y] = FALLBACK.events[y];
            });
          }
        });
        dataCache = data;
        return data;
      })
      .catch(function (err) {
        console.error('[NSS data] failed to load data; using offline fallback snapshot.', err);
        dataCache = FALLBACK;
        return FALLBACK;
      });
  }

  function getEvents(year) {
    return getData().then(function (d) {
      return (d.events && d.events[year]) || [];
    });
  }

  /* ---------- 7. Render-completion coordination ----------
     Page renderers call NSS.markRendering() synchronously (at script parse)
     and NSS.renderComplete() once their DOM is in place. When every marked
     renderer finishes, the 'nssRendered' event fires. Animation code
     (script.js / testimonials.js) uses NSS.onRendered() to wait for it so
     GSAP only targets elements that actually exist. A safety timer guarantees
     the event always fires even if a renderer is missing on a page. */
  var rendererCount = 0;
  var rendererDone = 0;
  var renderedFired = false;
  var renderedWaiters = [];

  function markRendering() {
    rendererCount++;
  }

  function fireRendered() {
    if (renderedFired) return;
    renderedFired = true;
    var evt = (typeof window.CustomEvent === 'function')
      ? new CustomEvent('nssRendered')
      : new Event('nssRendered');
    window.dispatchEvent(evt);
    renderedWaiters.forEach(function (cb) { try { cb(); } catch (e) {} });
    renderedWaiters = [];
  }

  function renderComplete() {
    rendererDone++;
    if (rendererCount > 0 && rendererDone >= rendererCount) {
      fireRendered();
    }
  }

  function onRendered(cb) {
    if (renderedFired) {
      try { cb(); } catch (e) {}
      return;
    }
    renderedWaiters.push(cb);
  }

  /* Safety net: if for any reason the signal never fires, release waiters. */
  if (typeof window !== 'undefined' && typeof setTimeout === 'function') {
    setTimeout(fireRendered, 3500);
  }

  /* ---------- 7b. Shared footer renderer ----------
     Every page calls NSS.renderFooter(data) to fill the contact details,
     brand text and copyright from data/site.json. The per-page decorative
     suffix after the copyright (e.g. ". Jai Hind.") is preserved via the
     data-copyright-suffix attribute on the footer-bottom <p>. */
  function renderFooter(data) {
    if (!data || !data.site || !data.site.contact) return;
    var contact = data.site.contact;
    var esc = escapeHtml;

    var collegeName = esc(contact.college || 'TSEC');
    // Footer brand header in the original static site is "NSS TSEC", while the
    // contact link text uses the college short name ("TSEC"). Reproduce that.
    var brandName = esc(
      (function (c) {
        c = String(c || 'TSEC').trim();
        return /^NSS\b/i.test(c) ? c : 'NSS ' + c;
      })(contact.college || 'TSEC')
    );
    var address = esc(contact.address || 'Mumbai, Kandivali East');
    var email = esc(contact.email || 'nss@tsecmumbai.in');
    var collegeUrl = contact.collegeUrl || 'https://tsecmumbai.in/';
    var tagline = contact.tagline || 'Not Me, But You.';
    var copyright = contact.copyright || '2026 NSS TSEC Mumbai';

    document.querySelectorAll('.footer').forEach(function (footer) {
      var brand = footer.querySelector('.footer-brand');
      if (brand) {
        var bH = brand.querySelector('h2');
        if (bH) bH.textContent = brandName;
        var bP = brand.querySelector('p');
        if (bP) bP.textContent = tagline;
      }

      var fc = footer.querySelector('.footer-contact');
      if (fc) {
        var lines = '';
        (contact.phoneLines || []).forEach(function (line) {
          if (!line || !line.phone) return;
          lines += '<p style="margin-top: 8px;">' + esc(line.label) +
                   ': <a href="tel:' + esc(line.phone) + '">' + esc(line.phone) + '</a></p>';
        });
        fc.innerHTML = '<h3>Connect</h3>' +
          '<p><a href="' + esc(collegeUrl) + '" target="_blank" style="text-decoration: underline;">' + collegeName + '</a> ' + address + '</p>' +
          '<p>Email: <a href="mailto:' + email + '">' + email + '</a></p>' +
          '<div class="contact-details" style="margin-top: 12px; font-size: 0.85rem; line-height: 1.5;">' + lines + '</div>';
      }

      var bottom = footer.querySelector('.footer-bottom p');
      if (bottom) {
        var suffix = bottom.getAttribute('data-copyright-suffix') || '';
        bottom.textContent = '\u00a9 ' + copyright + suffix;
      }
    });
  }

  /* ---------- 8. Expose the namespace ---------- */
  window.NSS = {
    getData: getData,
    getEvents: getEvents,
    escapeHtml: escapeHtml,
    markRendering: markRendering,
    renderComplete: renderComplete,
    onRendered: onRendered,
    renderFooter: renderFooter
  };
})();
