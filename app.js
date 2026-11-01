/**
 * ME DO RE TOWERS — LUXURY SCROLL PROLOGUE & WEBSITE ENGINE
 * 4-Stage Pre-Homepage Experience:
 * 1. Wide Dubai View (Palm Jumeirah & 3D Masterplan)
 * 2. Zoom to JLT Lake & Tower Cluster
 * 3. Zooming to ME DO RE Tower
 * 4. Interactive Building Levels (Architectural Inspections) -> "GO EXPLORE WEBSITE"
 */

(function () {
  'use strict';

  // DOM Elements - Prologue
  const sitePrologue = document.getElementById('sitePrologue');
  const btnSkipIntro = document.getElementById('btnSkipIntro');
  const btnGoExplore = document.getElementById('btnGoExplore');
  const btnReplayPrologue = document.getElementById('btnReplayPrologue');
  const prologueStepNav = document.getElementById('prologueStepNav');

  // Layers
  const pLayerView1 = document.getElementById('pLayerView1');
  const pLayerView2 = document.getElementById('pLayerView2');
  const pLayerBuilding = document.getElementById('pLayerBuilding');
  const pBuildingImg = document.getElementById('pBuildingImg');
  const buildingLevelsOverlay = document.getElementById('buildingLevelsOverlay');

  // Story Steps
  const pStep1 = document.getElementById('pStep1');
  const pStep2 = document.getElementById('pStep2');
  const pStep3 = document.getElementById('pStep3');
  const pStep4 = document.getElementById('pStep4');
  const pSteps = [pStep1, pStep2, pStep3, pStep4];

  // Progress Rail & Labels
  const pRailFill = document.getElementById('pRailFill');
  const pLabel1 = document.getElementById('pLabel1');
  const pLabel2 = document.getElementById('pLabel2');
  const pLabel3 = document.getElementById('pLabel3');
  const pLabel4 = document.getElementById('pLabel4');
  const pLabels = [pLabel1, pLabel2, pLabel3, pLabel4];

  // Architectural Level Modal Elements
  const archLevelModal = document.getElementById('archLevelModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const btnModalClose = document.getElementById('btnModalClose');
  const modalArchImg = document.getElementById('modalArchImg');
  const modalLevelTag = document.getElementById('modalLevelTag');
  const modalLevelTitle = document.getElementById('modalLevelTitle');
  const modalLevelDesc = document.getElementById('modalLevelDesc');
  const modalSpecArea = document.getElementById('modalSpecArea');
  const modalSpecCeiling = document.getElementById('modalSpecCeiling');
  const modalSpecView = document.getElementById('modalSpecView');
  const modalSpecSmart = document.getElementById('modalSpecSmart');
  const modalBlueprintBadge = document.getElementById('modalBlueprintBadge');

  // Architectural Specification Data by Level
  const levelData = {
    penthouse: {
      tag: 'LEVEL 38 - 39',
      title: 'The Crown Sky Duplex Penthouse',
      desc: 'Exquisite double-height duplex layout featuring 360-degree glass curtain walls, private open sky terrace with infinity plunge pool, Italian marble finishes, automated louvers, and private elevator foyer.',
      area: '5,850 Sq.Ft (543.5 m²)',
      ceiling: '6.4 Meters (Double Height)',
      view: '360° Dubai Marina, JLT Lake & Sea',
      smart: 'KNX / Crestron AI Automation',
      badge: 'ARCHITECTURAL SCHEMATIC · DRAFT v2.4',
      image: 'public/images/penthouse-living.png'
    },
    pool: {
      tag: 'LEVEL 20 - 21',
      title: 'Infinity Sky Pool, Spa & Wellness Club',
      desc: 'Cantilevered elevated leisure sanctuary featuring an infinity horizon swimming pool, hydro-massage jacuzzi jets, Finnish cedar sauna, steam wellness suite, and designer cabanas overlooking Dubai skyline.',
      area: '8,200 Sq.Ft Wellness Deck',
      ceiling: '5.0 Meters Panoramic Deck',
      view: 'Direct JLT Central Lake & Horizon',
      smart: 'Automated Climate & Water Filtration',
      badge: 'ENGINEERING BLUEPRINT · LEVEL 20/21',
      image: 'public/images/property-1.jpg'
    },
    residences: {
      tag: 'LEVEL 05 - 37',
      title: 'Smart Luxury 1, 2 & 3 Bedroom Residences',
      desc: 'Thoughtfully engineered designer residences fitted with smart acoustic glazing, German acoustic insulation, Kohler luxury sanitary fixtures, Italian porcelain stoneware, and biometric smart door locks.',
      area: '780 – 2,450 Sq.Ft Options',
      ceiling: '3.3 Meters Finished Clear Height',
      view: 'Panoramic Lakefront & Golf Course Views',
      smart: 'Smart Video Intercom & AI Lighting',
      badge: 'TYPICAL FLOORPLAN · UNITS 501-3708',
      image: 'public/images/property-2.jpg'
    },
    podium: {
      tag: 'GROUND & PODIUM',
      title: 'Grand Atrium Lobby & Waterfront Promenade',
      desc: 'Magnificent triple-height reception lobby clad in book-matched Italian statuario marble, bespoke 24/7 concierge desk, automated VIP valet parking access, and direct lakefront alfresco promenade terrace.',
      area: '12,000 Sq.Ft Atrium & Retail Base',
      ceiling: '10.5 Meters Triple-Height Atrium',
      view: 'Lake Promenade & Landscaped Piazza',
      smart: 'License Plate Recognition & Touchless Access',
      badge: 'MASTER PODIUM SPECIFICATION · G+P4',
      image: 'public/images/medore-facade.jpg'
    }
  };

  // State Variables
  let isPrologueActive = true;
  let targetPProg = 0;   // 0.0 to 1.0 (bidirectional virtual progress)
  let currentPProg = 0;  // smoothly lerped
  let isModalOpen = false;

  // Preload Images
  const preloadImages = [
    'public/images/dubai-view-1.jpg',
    'public/images/dubai-view-2.jpg',
    'public/images/medore-exterior.jpg',
    'public/images/penthouse-living.png',
    'public/images/property-1.jpg',
    'public/images/property-2.jpg',
    'public/images/medore-facade.jpg'
  ];
  preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // =========================================================================
  // PROLOGUE BIDIRECTIONAL SCROLL, TOUCH & KEYBOARD ENGINE
  // =========================================================================
  function handleWheel(e) {
    if (!isPrologueActive || isModalOpen) return;
    e.preventDefault();

    const delta = e.deltaY || e.detail || 0;
    const speed = 0.00085;
    // Bidirectional: increases when scrolling down, decreases when scrolling up
    targetPProg = Math.max(0, Math.min(1.0, targetPProg + delta * speed));
  }

  let touchStartY = 0;
  function handleTouchStart(e) {
    if (!isPrologueActive || isModalOpen) return;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    if (!isPrologueActive || isModalOpen) return;
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    touchStartY = touchY;

    // Bidirectional touch swipe
    targetPProg = Math.max(0, Math.min(1.0, targetPProg + diff * 0.0018));
  }

  function handleKeyDown(e) {
    if (!isPrologueActive) return;
    if (e.key === 'Escape' && isModalOpen) {
      closeLevelModal();
      return;
    }
    if (isModalOpen) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      targetPProg = Math.min(1.0, targetPProg + 0.12);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      targetPProg = Math.max(0, targetPProg - 0.12);
    }
  }

  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('keydown', handleKeyDown);

  // Step Nav Button Clicks
  const stepNavBtns = document.querySelectorAll('#prologueStepNav .step-nav-btn');
  stepNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = parseInt(btn.getAttribute('data-step'), 10);
      if (step === 1) targetPProg = 0.05;
      else if (step === 2) targetPProg = 0.38;
      else if (step === 3) targetPProg = 0.68;
      else if (step === 4) targetPProg = 0.95;
    });
  });

  // Modal Functions
  function openLevelModal(levelKey) {
    const data = levelData[levelKey];
    if (!data) return;

    if (modalLevelTag) modalLevelTag.textContent = data.tag;
    if (modalLevelTitle) modalLevelTitle.textContent = data.title;
    if (modalLevelDesc) modalLevelDesc.textContent = data.desc;
    if (modalSpecArea) modalSpecArea.textContent = data.area;
    if (modalSpecCeiling) modalSpecCeiling.textContent = data.ceiling;
    if (modalSpecView) modalSpecView.textContent = data.view;
    if (modalSpecSmart) modalSpecSmart.textContent = data.smart;
    if (modalBlueprintBadge) modalBlueprintBadge.textContent = data.badge;
    if (modalArchImg) {
      modalArchImg.src = data.image;
      modalArchImg.alt = data.title;
    }

    if (archLevelModal) {
      archLevelModal.classList.add('open');
      isModalOpen = true;
    }
  }

  function closeLevelModal() {
    if (archLevelModal) {
      archLevelModal.classList.remove('open');
      isModalOpen = false;
    }
  }

  // Attach click events to level rows
  document.querySelectorAll('.building-level-row').forEach(row => {
    row.addEventListener('click', (e) => {
      e.stopPropagation();
      const level = row.getAttribute('data-level');
      openLevelModal(level);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeLevelModal);
  if (btnModalClose) btnModalClose.addEventListener('click', closeLevelModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeLevelModal);

  // Dismiss / Enter Website Action
  function dismissPrologue() {
    closeLevelModal();
    isPrologueActive = false;
    document.body.classList.remove('prologue-active');
    if (sitePrologue) {
      sitePrologue.classList.add('dismissed');
    }
    // Start home hero video
    const heroVid = document.getElementById('homeHeroVideo');
    if (heroVid) heroVid.play().catch(() => {});
  }

  // Replay Prologue Action
  function replayPrologue() {
    isPrologueActive = true;
    targetPProg = 0;
    currentPProg = 0;
    document.body.classList.add('prologue-active');
    if (sitePrologue) {
      sitePrologue.classList.remove('dismissed');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  if (btnSkipIntro) btnSkipIntro.addEventListener('click', dismissPrologue);
  if (btnGoExplore) btnGoExplore.addEventListener('click', dismissPrologue);
  if (btnReplayPrologue) btnReplayPrologue.addEventListener('click', replayPrologue);

  // Prologue Visual Render Loop
  function renderPrologueLoop() {
    if (isPrologueActive) {
      const diff = targetPProg - currentPProg;
      currentPProg += diff * 0.085;

      if (pRailFill) {
        pRailFill.style.width = `${(currentPProg * 100).toFixed(1)}%`;
      }

      updatePrologueLayers(currentPProg);
      updatePrologueStory(currentPProg);
    }

    requestAnimationFrame(renderPrologueLoop);
  }
  requestAnimationFrame(renderPrologueLoop);

  function updatePrologueLayers(p) {
    // -------------------------------------------------------------
    // STAGE 1: FIRST VIEW (DUBAI 3D PANORAMA) (0.00 to 0.28)
    // -------------------------------------------------------------
    let v1Opacity = 0;
    let v1Scale = 1.0;
    let v1Tx = 0;
    let v1Ty = 0;

    if (p < 0.28) {
      v1Opacity = 1;
      const subProg = p / 0.28;
      v1Scale = 1.0 + (subProg * 0.15); // gentle scale into scene
      v1Tx = -(subProg * 2.0);
      v1Ty = -(subProg * 1.5);
    } else if (p < 0.38) {
      // Crossfade out to Stage 2
      v1Opacity = Math.max(0, 1 - (p - 0.28) / 0.10);
      v1Scale = 1.15 + ((p - 0.28) * 0.4);
    }

    if (pLayerView1) {
      pLayerView1.style.opacity = v1Opacity.toFixed(3);
      pLayerView1.style.transform = `scale(${v1Scale.toFixed(3)}) translate(${v1Tx.toFixed(2)}%, ${v1Ty.toFixed(2)}%)`;
      pLayerView1.style.visibility = v1Opacity > 0.01 ? 'visible' : 'hidden';
    }

    // -------------------------------------------------------------
    // STAGE 2: SECOND VIEW (JLT LAKE & CLUSTER ZOOM) (0.28 to 0.58)
    // -------------------------------------------------------------
    let v2Opacity = 0;
    let v2Scale = 1.0;
    let v2Tx = 0;
    let v2Ty = 0;

    if (p >= 0.24 && p < 0.58) {
      if (p < 0.38) {
        v2Opacity = (p - 0.24) / 0.14;
      } else {
        v2Opacity = 1;
      }
      const subProg = Math.max(0, (p - 0.28) / 0.30);
      v2Scale = 1.02 + (subProg * 0.24); // Zoom in on the cluster
      v2Tx = -(subProg * 4.0);
      v2Ty = -(subProg * 3.0);
    } else if (p >= 0.58 && p < 0.68) {
      // Crossfade out to Stage 3
      v2Opacity = Math.max(0, 1 - (p - 0.58) / 0.10);
      v2Scale = 1.26 + ((p - 0.58) * 0.3);
    }

    if (pLayerView2) {
      pLayerView2.style.opacity = v2Opacity.toFixed(3);
      pLayerView2.style.transform = `scale(${v2Scale.toFixed(3)}) translate(${v2Tx.toFixed(2)}%, ${v2Ty.toFixed(2)}%)`;
      pLayerView2.style.visibility = v2Opacity > 0.01 ? 'visible' : 'hidden';
    }

    // -------------------------------------------------------------
    // STAGE 3 & 4: BUILDING ZOOM & INTERACTIVE LEVELS (0.58 to 1.00)
    // -------------------------------------------------------------
    let bOpacity = 0;
    let bScale = 1.0;
    let bTy = 0;

    if (p >= 0.54) {
      if (p < 0.68) {
        bOpacity = (p - 0.54) / 0.14;
      } else {
        bOpacity = 1;
      }

      // Camera zooms smoothly into ME DO RE Tower
      const bProgress = Math.max(0, (p - 0.58) / 0.42);
      bScale = 1.0 + (bProgress * 0.18);
      bTy = -(bProgress * 6.0);
    }

    if (pLayerBuilding) {
      pLayerBuilding.style.opacity = bOpacity.toFixed(3);
      pLayerBuilding.style.transform = `scale(${bScale.toFixed(3)}) translateY(${bTy.toFixed(2)}%)`;
      pLayerBuilding.style.visibility = bOpacity > 0.01 ? 'visible' : 'hidden';
    }

    // Interactive building levels activation (Stage 4: 0.78 to 1.00)
    if (buildingLevelsOverlay) {
      if (p >= 0.76) {
        buildingLevelsOverlay.classList.add('active');
      } else {
        buildingLevelsOverlay.classList.remove('active');
      }
    }
  }

  function updatePrologueStory(p) {
    let stepIndex = 0;

    if (p < 0.28) {
      stepIndex = 0; // Stage 1: Dubai Panorama
    } else if (p < 0.58) {
      stepIndex = 1; // Stage 2: JLT Cluster
    } else if (p < 0.78) {
      stepIndex = 2; // Stage 3: The Building Zoom
    } else {
      stepIndex = 3; // Stage 4: Interactive Levels & Go Explore
    }

    pSteps.forEach((step, idx) => {
      if (step) {
        if (idx === stepIndex) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      }
    });

    stepNavBtns.forEach((btn, idx) => {
      if (btn) {
        if (idx === stepIndex) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });

    pLabels.forEach((label, idx) => {
      if (label) {
        if (idx === stepIndex) {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
      }
    });
  }

  // =========================================================================
  // MAIN WEBSITE BEHAVIORS (HEADER SCROLL, TABS, FLOORPLANS, FORMS)
  // =========================================================================
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Navigation Toggle
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      primaryNav.classList.toggle('active');
    });

    document.querySelectorAll('.primary-nav .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('active');
      });
    });
  }

  // Collection Tabs
  const filterBtns = document.querySelectorAll('#collectionTabs .tab-btn');
  const propertyCards = document.querySelectorAll('.properties-grid .property-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      propertyCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Penthouse Image Switcher
  const penthouseDisplay = document.getElementById('penthouseDisplayImg');
  const penthouseThumbs = document.querySelectorAll('.penthouse-thumbs .thumb-btn');

  penthouseThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      penthouseThumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const newSrc = thumb.getAttribute('data-src');
      if (penthouseDisplay && newSrc) {
        penthouseDisplay.style.opacity = '0';
        setTimeout(() => {
          penthouseDisplay.src = newSrc;
          penthouseDisplay.style.opacity = '1';
        }, 200);
      }
    });
  });

  // Floor Plans Data
  const floorplanData = {
    studio: {
      badge: 'SMART STUDIO SUITE',
      title: 'Studio Luxury Apartment',
      summary: 'Optimized open-plan layout featuring integrated smart storage, sleek kitchen, spa shower, and private balcony overlooking JLT waterways.',
      area: '485 Sq.Ft (45.06 Sq.M)',
      balcony: '65 Sq.Ft (6.04 Sq.M)',
      baths: '1 Deluxe Bathroom',
      view: 'Community Park & Water View',
      svg: `
        <svg viewBox="0 0 600 400" class="blueprint-svg">
          <rect x="50" y="40" width="500" height="320" fill="none" stroke="#c89b4b" stroke-width="2" stroke-dasharray="6 4" />
          <rect x="70" y="60" width="310" height="280" fill="rgba(200, 155, 75, 0.12)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="225" y="190" fill="#f6f4f1" font-size="16" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-weight="600">STUDIO LIVING & BEDROOM</text>
          <rect x="400" y="60" width="130" height="150" fill="rgba(200, 155, 75, 0.08)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="465" y="140" fill="#9ba3af" font-size="13" text-anchor="middle">DELUXE BATH</text>
          <rect x="400" y="230" width="130" height="110" fill="rgba(200, 155, 75, 0.2)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="465" y="290" fill="#e6b764" font-size="13" text-anchor="middle">BALCONY</text>
        </svg>
      `
    },
    '1bed': {
      badge: 'SMART RESIDENCE TYPE A',
      title: '1 Bedroom Luxury Apartment',
      summary: 'An exquisitely configured 1-bedroom home with an expansive salon, powder room for guests, designer kitchen with built-in appliances, and direct access to a deep private balcony.',
      area: '895 Sq.Ft (83.15 Sq.M)',
      balcony: '115 Sq.Ft (10.68 Sq.M)',
      baths: '2 (1 Ensuite + Powder Room)',
      view: 'JLT Lake & Skyline',
      svg: `
        <svg viewBox="0 0 600 400" class="blueprint-svg">
          <rect x="20" y="20" width="560" height="360" fill="none" stroke="#c89b4b" stroke-width="2" stroke-dasharray="6 4" />
          <rect x="40" y="40" width="220" height="170" fill="rgba(200, 155, 75, 0.08)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="150" y="130" fill="#f6f4f1" font-size="14" text-anchor="middle" font-family="'Plus Jakarta Sans'">MASTER SUITE</text>
          <rect x="280" y="40" width="280" height="230" fill="rgba(200, 155, 75, 0.12)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="420" y="160" fill="#f6f4f1" font-size="16" text-anchor="middle" font-family="'Plus Jakarta Sans'" font-weight="600">LIVING & DINING SALON</text>
          <rect x="280" y="290" width="280" height="70" fill="rgba(200, 155, 75, 0.2)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="420" y="332" fill="#e6b764" font-size="13" text-anchor="middle">PANORAMIC TERRACE</text>
          <rect x="40" y="230" width="130" height="130" fill="rgba(200, 155, 75, 0.08)" stroke="#c89b4b" stroke-width="1" />
          <text x="105" y="300" fill="#9ba3af" font-size="12" text-anchor="middle">KITCHEN</text>
          <rect x="180" y="230" width="80" height="130" fill="rgba(200, 155, 75, 0.08)" stroke="#c89b4b" stroke-width="1" />
          <text x="220" y="300" fill="#9ba3af" font-size="11" text-anchor="middle">BATH</text>
        </svg>
      `
    },
    '2bed': {
      badge: 'CORNER RESIDENCE TYPE B',
      title: '2 Bedroom Executive Apartment',
      summary: 'Dual aspect corner sanctuary offering panoramic views across the lakes. Features two ensuite master bedrooms, laundry room, gourmet island kitchen, and dual balconies.',
      area: '1,420 Sq.Ft (131.92 Sq.M)',
      balcony: '185 Sq.Ft (17.18 Sq.M)',
      baths: '3 (2 Ensuite + Powder Room)',
      view: 'Panoramic Dual Lake Aspect',
      svg: `
        <svg viewBox="0 0 600 400" class="blueprint-svg">
          <rect x="20" y="20" width="560" height="360" fill="none" stroke="#c89b4b" stroke-width="2" stroke-dasharray="6 4" />
          <rect x="40" y="40" width="170" height="150" fill="rgba(200, 155, 75, 0.08)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="125" y="120" fill="#f6f4f1" font-size="12" text-anchor="middle">MASTER SUITE 1</text>
          <rect x="40" y="210" width="170" height="150" fill="rgba(200, 155, 75, 0.08)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="125" y="290" fill="#f6f4f1" font-size="12" text-anchor="middle">BEDROOM 2</text>
          <rect x="230" y="40" width="330" height="230" fill="rgba(200, 155, 75, 0.12)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="395" y="160" fill="#f6f4f1" font-size="16" text-anchor="middle" font-weight="600">CORNER SALON & DINING</text>
          <rect x="230" y="290" width="330" height="70" fill="rgba(200, 155, 75, 0.2)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="395" y="332" fill="#e6b764" font-size="13" text-anchor="middle">WRAP-AROUND BALCONY</text>
        </svg>
      `
    },
    '3bed': {
      badge: 'SIGNATURE RESIDENCE TYPE C',
      title: '3 Bedroom Prestige Residence',
      summary: 'Grand family residence with maid quarters, show kitchen plus prep kitchen, dedicated family lounge, and expansive glass curtain walls framing Marina skyline sunsets.',
      area: '2,240 Sq.Ft (208.10 Sq.M)',
      balcony: '280 Sq.Ft (26.01 Sq.M)',
      baths: '4 (3 Ensuite + Powder Room + Maid)',
      view: 'Dubai Marina & Golf Course',
      svg: `
        <svg viewBox="0 0 600 400" class="blueprint-svg">
          <rect x="20" y="20" width="560" height="360" fill="none" stroke="#c89b4b" stroke-width="2" stroke-dasharray="6 4" />
          <rect x="40" y="40" width="140" height="140" fill="rgba(200, 155, 75, 0.08)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="110" y="115" fill="#f6f4f1" font-size="11" text-anchor="middle">MASTER SUITE</text>
          <rect x="40" y="200" width="140" height="160" fill="rgba(200, 155, 75, 0.08)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="110" y="285" fill="#f6f4f1" font-size="11" text-anchor="middle">BEDROOM 2 & 3</text>
          <rect x="200" y="40" width="360" height="230" fill="rgba(200, 155, 75, 0.14)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="380" y="160" fill="#f6f4f1" font-size="16" text-anchor="middle" font-weight="600">GRAND RECEPTION & SALON</text>
          <rect x="200" y="290" width="360" height="70" fill="rgba(200, 155, 75, 0.22)" stroke="#c89b4b" stroke-width="1.5" />
          <text x="380" y="332" fill="#e6b764" font-size="13" text-anchor="middle">SUNSET TERRACE</text>
        </svg>
      `
    },
    penthouse: {
      badge: 'CROWN COLLECTION',
      title: 'Sky Duplex Royal Penthouse',
      summary: 'The pinnacle of luxury high-rise living. Spanning 2 levels with private infinity plunge pool, double-height entertainment salon, private lift, and 360-degree views of Dubai.',
      area: '5,850 Sq.Ft (543.48 Sq.M)',
      balcony: '850 Sq.Ft Sky Terrace',
      baths: '6 Luxury Marble Bathrooms',
      view: '360° Marina, Sea & Golf Views',
      svg: `
        <svg viewBox="0 0 600 400" class="blueprint-svg">
          <rect x="20" y="20" width="560" height="360" fill="none" stroke="#ffd56b" stroke-width="2.5" />
          <rect x="40" y="40" width="240" height="170" fill="rgba(255, 213, 107, 0.12)" stroke="#ffd56b" stroke-width="1.5" />
          <text x="160" y="130" fill="#ffd56b" font-size="14" text-anchor="middle" font-weight="600">ROYAL MASTER SUITE</text>
          <rect x="300" y="40" width="260" height="220" fill="rgba(255, 213, 107, 0.16)" stroke="#ffd56b" stroke-width="1.5" />
          <text x="430" y="155" fill="#f6f4f1" font-size="15" text-anchor="middle" font-weight="700">DOUBLE-HEIGHT GRAND SALON</text>
          <rect x="40" y="230" width="240" height="130" fill="rgba(255, 213, 107, 0.1)" stroke="#ffd56b" stroke-width="1.5" />
          <text x="160" y="300" fill="#f6f4f1" font-size="13" text-anchor="middle">SPA & WELLNESS DECK</text>
          <rect x="300" y="280" width="260" height="80" fill="rgba(248, 182, 22, 0.28)" stroke="#ffd56b" stroke-width="1.5" />
          <text x="430" y="328" fill="#ffd56b" font-size="14" text-anchor="middle" font-weight="700">PRIVATE SKY POOL & TERRACE</text>
        </svg>
      `
    }
  };

  const fpBtns = document.querySelectorAll('#floorplanNav .fp-btn');
  const fpBadge = document.getElementById('fpBadge');
  const fpTitle = document.getElementById('fpTitle');
  const fpSummary = document.getElementById('fpSummary');
  const fpArea = document.getElementById('fpArea');
  const fpBalcony = document.getElementById('fpBalcony');
  const fpBaths = document.getElementById('fpBaths');
  const fpView = document.getElementById('fpView');
  const fpSchematic = document.getElementById('fpSchematic');

  fpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fpBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const unit = btn.getAttribute('data-unit');
      const data = floorplanData[unit];
      if (!data) return;

      fpBadge.textContent = data.badge;
      fpTitle.textContent = data.title;
      fpSummary.textContent = data.summary;
      fpArea.textContent = data.area;
      fpBalcony.textContent = data.balcony;
      fpBaths.textContent = data.baths;
      fpView.textContent = data.view;
      fpSchematic.innerHTML = data.svg;
    });
  });

  // VIP Form
  const form = document.getElementById('vipInquiryForm');
  const btnSubmit = document.getElementById('btnSubmitForm');
  const feedback = document.getElementById('formFeedback');

  if (form && btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const phone = document.getElementById('userPhone').value.trim();
      const property = document.getElementById('propertyInterest').value;

      if (!name || !email || !phone || !property) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please complete all required fields (*).';
        return;
      }

      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<span>PROCESSING VIP REQUEST...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
      feedback.textContent = '';

      setTimeout(() => {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `<span>INQUIRY SUBMITTED</span> <i class="fa-solid fa-check"></i>`;
        feedback.className = 'form-feedback success';
        const refNo = 'MDR-' + Math.floor(100000 + Math.random() * 900000);
        feedback.innerHTML = `Thank you, <strong>${name}</strong>. Your VIP inquiry [Ref: ${refNo}] has been registered. Our private client advisor will contact you within 2 hours.`;
        form.reset();
      }, 1200);
    });
  }

  // Audio Toggle
  function initAmbientAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      ambientGain = audioCtx.createGain();
      ambientGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, audioCtx.currentTime);

      const osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, audioCtx.currentTime);

      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(165, audioCtx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);

      osc1.start();
      osc2.start();

      return true;
    } catch (e) {
      return false;
    }
  }

  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (!audioCtx) initAmbientAudio();

      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isAudioPlaying = !isAudioPlaying;

      if (isAudioPlaying) {
        if (ambientGain) ambientGain.gain.setTargetAtTime(0.12, audioCtx.currentTime, 0.8);
        audioToggle.classList.add('playing');
      } else {
        if (ambientGain) ambientGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.5);
        audioToggle.classList.remove('playing');
      }
    });
  }

})();
