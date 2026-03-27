(function () {
  const data = window.teamSiteData;
  if (!data) return;

  const page = document.body.dataset.page;

  function runIntro() {
    if (page !== "home") return;

    const intro = document.getElementById("intro-screen");
    if (!intro) return;

    document.body.classList.add("intro-active");

    window.setTimeout(() => {
      intro.classList.add("is-hidden");
      document.body.classList.remove("intro-active");
    }, 1900);
  }

  function createPlaceholder(note) {
    const wrapper = document.createElement("div");
    wrapper.className = "placeholder-content";

    const copy = document.createElement("span");
    copy.textContent = note;

    wrapper.append(copy);
    return wrapper;
  }

  function renderImage(container, item, fallbackNote) {
    container.innerHTML = "";
    if (item.image) {
      const image = document.createElement("img");
      image.className = "image-fill";
      image.src = item.image;
      image.alt = item.name;
      container.appendChild(image);
      return;
    }
    container.appendChild(createPlaceholder(fallbackNote));
  }

  function appendPosterName(container, name) {
    const label = document.createElement("div");
    label.className = "poster-name";
    label.textContent = name;
    container.appendChild(label);
  }

  function renderImageCarousel(container, item, fallbackNote) {
    const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];

    if (images.length === 0) {
      renderImage(container, item, fallbackNote);
      return;
    }

    container.innerHTML = "";
    const image = document.createElement("img");
    image.className = "image-fill";
    image.src = images[0];
    image.alt = item.name;
    image.classList.add("carousel-image");
    container.appendChild(image);

    if (images.length > 1) {
      let index = 0;
      let isHovered = false;

      const advance = () => {
        if (isHovered) return;
        image.classList.add("is-transitioning");
        window.setTimeout(() => {
          index = (index + 1) % images.length;
          image.src = images[index];
        }, 180);
        window.setTimeout(() => {
          image.classList.remove("is-transitioning");
        }, 360);
      };

      window.setInterval(advance, 1500);
      container.addEventListener("mouseenter", () => {
        isHovered = true;
      });
      container.addEventListener("mouseleave", () => {
        isHovered = false;
      });
    }
  }

  function metricCard(label, value) {
    const card = document.createElement("div");
    card.className = "metric";
    card.innerHTML = `<span class="metric-value">${value}</span><span class="metric-label">${label}</span>`;
    return card;
  }

  function getVisibleStats(player) {
    const stats = [
      ["Matches", player.stats.matches],
      ["Runs", player.stats.runs],
      ["Bat Avg", player.stats.battingAverage],
      ["Strike Rate", player.stats.strikeRate],
    ];

    const isBattingProfile =
      player.filter.includes("batsman") || player.filter.includes("wicket-keeper");

    if (!isBattingProfile || player.filter.includes("all-rounder") || player.filter.includes("bowler")) {
      stats.splice(2, 0, ["Wickets", player.stats.wickets]);
      stats.push(["Economy", player.stats.economy]);
    }

    return stats;
  }

  function titleCaseRole(role) {
    return role.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  runIntro();

  if (page === "home") {
    document.getElementById("league-name").textContent = data.league.shortName;
    document.getElementById("league-description").textContent = data.league.description;
    document.getElementById("league-story").textContent = data.league.story;
    document.getElementById("poster-summary").textContent = `${data.players.length} players. One mission.`;

    const posterGrid = document.getElementById("poster-grid");
    const teamHighlights = document.getElementById("team-highlights");
    const ownerPhoto = document.getElementById("owner-photo");
    const ownerName = document.getElementById("owner-name");
    const ownerBio = document.getElementById("owner-bio");
    const ownerMeta = document.getElementById("owner-meta");
    const franchiseDetails = document.getElementById("franchise-details");
    const rosterGrid = document.getElementById("roster-grid");

    data.players.forEach((player) => {
      const tile = document.createElement("div");
      tile.className = "poster-tile";
      tile.style.background = `linear-gradient(180deg, rgba(255,255,255,0.04), transparent), radial-gradient(circle at 20% 20%, ${player.accent}44, transparent 36%), linear-gradient(180deg, rgba(23,74,146,0.76), rgba(8,15,28,0.98))`;
      renderImage(tile, { ...player, image: player.posterImage || player.image }, player.shortName);
      appendPosterName(tile, player.shortName);
      posterGrid.appendChild(tile);
    });

    data.highlights.forEach((item) => {
      const article = document.createElement("article");
      article.innerHTML = `<strong>${item.value}</strong><span>${item.label}</span>`;
      teamHighlights.appendChild(article);
    });

    renderImage(ownerPhoto, data.owner, "Add owner photo");
    ownerName.textContent = data.owner.name;
    ownerBio.textContent = data.owner.bio;

    data.owner.meta.forEach((meta) => {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = meta;
      ownerMeta.appendChild(pill);
    });

    data.league.franchiseDetails.forEach((detail) => {
      const li = document.createElement("li");
      li.textContent = detail;
      franchiseDetails.appendChild(li);
    });

    data.players.forEach((player) => {
      const card = document.createElement("article");
      card.className = "roster-card";

      const photo = document.createElement("div");
      photo.className = "roster-photo";
      photo.style.background = `linear-gradient(180deg, rgba(255,255,255,0.05), transparent), radial-gradient(circle at 18% 18%, ${player.accent}44, transparent 32%), linear-gradient(180deg, rgba(27,61,120,0.84), rgba(9,17,31,0.98))`;
      renderImage(photo, { ...player, image: player.image || player.posterImage }, "Add jersey photo");

      const header = document.createElement("div");
      header.className = "roster-card-header";
      header.innerHTML = `<h3>${player.shortName}</h3><p>${player.role}</p><p class="player-price">Bought for ${player.price}</p>`;

      card.append(photo, header);
      rosterGrid.appendChild(card);
    });
  }

  if (page === "players") {
    const sections = document.getElementById("player-sections");
    const chips = Array.from(document.querySelectorAll(".filter-chip"));

    data.players.forEach((player) => {
      const section = document.createElement("article");
      section.className = "player-section";
      section.dataset.filters = player.filter.join(" ");

      const visual = document.createElement("div");
      visual.className = "player-visual";
      visual.style.background = `linear-gradient(180deg, rgba(255,255,255,0.04), transparent), radial-gradient(circle at 22% 18%, ${player.accent}55, transparent 36%), linear-gradient(180deg, rgba(24,69,133,0.82), rgba(7,14,27,1))`;
      renderImageCarousel(visual, player, player.spotlight);

      const copy = document.createElement("div");
      copy.className = "player-copy";
      copy.innerHTML = `
        <div class="player-header">
          <div>
            <p class="eyebrow">${player.country}</p>
            <h3><small>${player.vibe}</small>${player.name}</h3>
          </div>
          <span class="tag is-highlight">${player.spotlight}</span>
        </div>
      `;

      const roleRow = document.createElement("div");
      roleRow.className = "player-role-row";
      [player.role, player.battingStyle, player.bowlingStyle].forEach((item) => {
        const pill = document.createElement("span");
        pill.className = "pill";
        pill.textContent = item;
        roleRow.appendChild(pill);
      });

      const summaryText = document.createElement("p");
      summaryText.className = "player-summary";
      summaryText.textContent = player.summary;

      const stats = document.createElement("div");
      stats.className = "player-stats";
      getVisibleStats(player).forEach(([label, value]) => {
        stats.appendChild(metricCard(label, value));
      });

      const achievements = document.createElement("div");
      achievements.className = "player-achievements";
      player.achievements.forEach((item) => {
        const block = document.createElement("div");
        block.className = "achievement";
        block.textContent = item;
        achievements.appendChild(block);
      });

      copy.append(roleRow, summaryText, stats, achievements);
      section.append(visual, copy);
      sections.appendChild(section);
    });

    function applyFilter(filter) {
      Array.from(sections.children).forEach((section) => {
        const filters = section.dataset.filters.split(" ");
        const show = filter === "all" || filters.includes(filter);
        section.classList.toggle("is-hidden", !show);
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((button) => button.classList.remove("is-active"));
        chip.classList.add("is-active");
        applyFilter(chip.dataset.filter);
      });
    });

    applyFilter("all");
  }
})();
