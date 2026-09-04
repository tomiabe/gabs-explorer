(function () {
  "use strict";

  window.GABS_PLACES = [
    {
      id: "kgale-hill",
      name: "Kgale Hill",
      category: "Outdoors",
      type: "Outdoor",
      area: "South Gaborone",
      fit: "Go before the heat",
      description: "The city opens up from here. A good climb, a clear head, and a view that makes the rest of the day feel possible.",
      tags: ["Walk", "Sunset", "Views"],
      intents: ["Tonight", "Weekend", "Outdoors", "Outdoor escape", "Worth the drive", "Under P300", "Quiet places"],
      image: "https://images.squarespace-cdn.com/content/v1/69b45542bd0c603556c11416/d92d9e58-e570-469c-9d0c-f27b1f840abd/Gaborone+Explorer+Title+photo+view+over+city+from+Kgale+Hill+Botswana.jpeg?format=1500w",
      mapQuery: "Kgale Hill, Gaborone, Botswana",
      profile: {
        verdict: "The reset button for a loud week. Bring water, leave enough time for the top, and watch Gaborone change scale beneath you.",
        bestFor: "Clear heads, visiting friends, a low cost afternoon",
        bestTime: "Early morning or close to sunset",
        priceGuide: "Plan for transport and your own water",
        access: "South Gaborone. The route is easiest with your own ride or a planned taxi.",
        note: "This is a place for the view, not the rush. Let the climb set the pace for the rest of your day.",
        practical: "Wear shoes with grip, check the weather, and avoid the hottest part of the day.",
        nearby: ["Two Six Seven", "Gaborone Dam"]
      }
    },
    {
      id: "two-six-seven",
      name: "Two Six Seven",
      category: "Eat and drink",
      type: "Restaurant",
      area: "Village",
      fit: "Dinner that can stretch",
      description: "A polished all rounder with indoor and outdoor space, a broad menu, and enough room for the night to change shape.",
      tags: ["Dinner", "Groups", "Outside"],
      intents: ["Tonight", "Weekend", "Date night", "Night out"],
      image: "https://images.squarespace-cdn.com/content/v1/69b45542bd0c603556c11416/1778609922222-CZ4M7X8F39B2UUXCM9FV/Gaborone+Explorer+Restaurants.jpg?format=1500w",
      mapQuery: "Two Six Seven, Gaborone, Botswana",
      profile: {
        verdict: "A dinner plan with room to grow. Start with a table, then decide whether you are staying for a second round.",
        bestFor: "Date nights, a proper catch up, groups that want options",
        bestTime: "Dinner through late evening",
        priceGuide: "A mid range dinner out. Confirm current menu prices before you go.",
        access: "Village. Easy to fold into a central Gaborone evening.",
        note: "The useful part is its flexibility. It works when the plan is a little open and the table may need to hold a few more people.",
        practical: "For a larger group or a busy evening, call ahead before leaving.",
        nearby: ["Main Mall", "Gaborone Dam"]
      }
    },
    {
      id: "mokolodi-bush-kitchen",
      name: "Mokolodi Bush Kitchen",
      category: "Outdoors",
      type: "Day trip",
      area: "Mokolodi",
      fit: "Make lunch the destination",
      description: "A reason to leave the city for a few hours. Pair lunch with a reserve visit and let the afternoon take its time.",
      tags: ["Drive", "Lunch", "Nature"],
      intents: ["Weekend", "Outdoor escape", "Worth the drive", "Local food", "Family day"],
      image: "https://images.squarespace-cdn.com/content/v1/69b45542bd0c603556c11416/1778610067062-3RCU9I305E6MUXLY49ZC/Gaborone+Explorer+Things+to+do+out.jpeg?format=1500w",
      mapQuery: "Mokolodi Nature Reserve, Botswana",
      profile: {
        verdict: "Make lunch the reason to get out of town. The best version of the day leaves room for a reserve visit and a slow drive back.",
        bestFor: "Family days, visitors, a weekend reset",
        bestTime: "Late morning into an unhurried afternoon",
        priceGuide: "Plan for food, transport, and reserve entry where needed",
        access: "Mokolodi. Better with a planned ride and a little more time than a city lunch.",
        note: "This is not an errand between other plans. Give it the day and it will give something back.",
        practical: "Check reserve access and food service before setting off.",
        nearby: ["Kgale Hill", "Gaborone Dam"]
      }
    },
    {
      id: "botswana-craft",
      name: "Botswana Craft",
      category: "Culture",
      type: "Culture",
      area: "Block 3",
      fit: "A slower local afternoon",
      description: "Craft, food, and a little breathing room. A place to see the work, meet the makers, and stay for lunch.",
      tags: ["Craft", "Lunch", "Local"],
      intents: ["Culture", "Slow morning", "First time in Gabs", "Local food", "Family day", "Under P300"],
      image: "https://images.squarespace-cdn.com/content/v1/69b45542bd0c603556c11416/1778609959557-UL1T43BVJM0Z312H1EW5/Gaborone+Explorer+Cafes.jpg?format=1500w",
      mapQuery: "Botswana Craft, Gaborone, Botswana",
      profile: {
        verdict: "A gentler way into the city. See local work, pick up a gift with a story, then let lunch take its time.",
        bestFor: "First visits, visitors, a softer weekend plan",
        bestTime: "Late morning and early afternoon",
        priceGuide: "Choose your own pace. Food and craft purchases vary.",
        access: "Block 3. A useful stop when you want something more considered than another mall.",
        note: "The value is not just what you buy. It is the pause, the people, and the sense of place.",
        practical: "Leave space in your bag if you are shopping for gifts.",
        nearby: ["Main Mall", "Two Six Seven"]
      }
    },
    {
      id: "gaborone-dam",
      name: "Gaborone Dam",
      category: "Outdoors",
      type: "Open air",
      area: "South Gaborone",
      fit: "Stay for the light",
      description: "An easy place to make an evening of it. Bring people, a blanket, and enough time to watch the sky move.",
      tags: ["Sunset", "Open air", "Easy"],
      intents: ["Tonight", "Weekend", "Outdoors", "Outdoor escape", "Under P300", "Quiet places"],
      image: "https://images.squarespace-cdn.com/content/v1/69b45542bd0c603556c11416/1778610127241-E8S0NS6YXQQH1V46XDW3/Gaborone+Explorer+Sunset+spots.jpeg?format=1500w",
      mapQuery: "Gaborone Dam, Botswana",
      profile: {
        verdict: "A simple evening plan that asks very little from you. Show up, settle in, and let the sky do most of the work.",
        bestFor: "Sunset, a quiet catch up, an easy outdoor plan",
        bestTime: "The hour before sunset",
        priceGuide: "Keep it simple. Plan for transport and anything you bring along.",
        access: "South Gaborone. Build your onward ride into the plan before the light goes.",
        note: "The city has plenty of busy nights. This is useful precisely because it does not need to be one of them.",
        practical: "Bring what you need and check local access conditions before you go.",
        nearby: ["Kgale Hill", "Two Six Seven"]
      }
    },
    {
      id: "main-mall",
      name: "Main Mall",
      category: "Shopping",
      type: "City life",
      area: "Central Gaborone",
      fit: "Start in the middle",
      description: "A useful city anchor for meeting, browsing, eating, and finding the next part of the day close by.",
      tags: ["Meet up", "Shopping", "Central"],
      intents: ["Tonight", "Weekend", "First time in Gabs", "Family day", "Slow morning", "Under P300"],
      image: "https://images.squarespace-cdn.com/content/v1/69b45542bd0c603556c11416/1778610035167-HSON3B1DXXB0ITL4CBZM/Gaborone+Explorer+Things+to+do+in.jpg?format=1500w",
      mapQuery: "Main Mall, Gaborone, Botswana",
      profile: {
        verdict: "A practical city anchor when the group has not decided yet. Meet here, then let the day take a direction.",
        bestFor: "Meeting in the middle, a first pass through town, casual browsing",
        bestTime: "Daytime through early evening",
        priceGuide: "Your plan decides the spend",
        access: "Central Gaborone. A natural link between errands, food, and the next stop.",
        note: "It is less about a single perfect moment and more about keeping options open.",
        practical: "Use it as a starting point, then choose one nearby thing worth slowing down for.",
        nearby: ["Botswana Craft", "Two Six Seven"]
      }
    }
  ];
})();
