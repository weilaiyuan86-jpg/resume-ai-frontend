// Extract content from the current page or inject into ResumeEditor
(() => {
  const isResumeEditor = location.pathname.includes('/resume-editor');
  const sendToPage = (payload) => {
    window.postMessage({ type: 'resumeai_import', payload }, '*');
  };
  const extractText = (el) => (el ? el.innerText.trim() : '');
  const limit = (txt, n = 5000) => (txt.length > n ? txt.slice(0, n) : txt);

  const extractFromLinkedIn = () => {
    const name =
      document.querySelector('h1.text-heading-xlarge') ||
      document.querySelector('.pv-text-details__left-panel h1');
    const title =
      document.querySelector('.text-body-medium.break-words') ||
      document.querySelector('div[data-view]="headline"]');
    const summaryBlock = document.querySelector(
      'section.pv-about-section, section.summary, .pv-profile-section.pv-about-section'
    );
    const expBlocks = [...document.querySelectorAll('section.experience, .experience-section, .pvs-list > li')];
    const eduBlocks = [...document.querySelectorAll('section.education, .education-section, .pvs-list > li')];
    const skillsBlocks = [...document.querySelectorAll('section.skills, .skills-section, .pvs-list > li')];

    const experience = expBlocks.slice(0, 5).map((el, i) => ({
      id: `li-${Date.now()}-${i}`,
      company: extractText(el.querySelector('.pv-entity__secondary-title')) || extractText(el.querySelector('.t-14.t-black--light')) || '',
      position: extractText(el.querySelector('.pv-entity__summary-info h3')) || extractText(el.querySelector('.t-bold')) || '',
      startDate: '',
      endDate: '',
      description: limit(extractText(el)),
      isOptimized: false,
    }));
    const education = eduBlocks.slice(0, 3).map((el, i) => ({
      id: `edu-${Date.now()}-${i}`,
      school: extractText(el.querySelector('.pv-entity__school-name')) || extractText(el.querySelector('.t-bold')) || '',
      degree: '',
      field: '',
      graduationDate: '',
    }));
    const skills = skillsBlocks.slice(0, 20).map((el) => extractText(el.querySelector('.pv-skill-category-entity__name-text')) || extractText(el)).filter(Boolean);

    return {
      personalInfo: {
        fullName: extractText(name) || '',
        title: extractText(title) || '',
        email: '',
        phone: '',
        location: '',
        linkedin: location.href,
        summary: limit(extractText(summaryBlock)) || '',
      },
      experience,
      education,
      skills,
    };
  };

  const extractFromIndeed = () => {
    const title = document.querySelector('h1.jobsearch-JobInfoHeader-title') || document.querySelector('h1');
    const company = document.querySelector('.jobsearch-CompanyInfoWithoutHeaderImage div a, .jobsearch-JobInfoHeader-subtitle div') || null;
    const description = document.querySelector('#jobDescriptionText') || document.querySelector('[data-testid="jobDescriptionText"]');
    const locationEl = document.querySelector('.jobsearch-CompanyInfoWithoutHeaderImage div:last-child') || null;
    return {
      personalInfo: { fullName: '', title: extractText(title) || '', email: '', phone: '', location: extractText(locationEl) || '', linkedin: '', summary: '' },
      experience: [{ id: `indeed-${Date.now()}`, company: extractText(company) || '', position: extractText(title) || '', startDate: '', endDate: '', description: limit(extractText(description) || ''), isOptimized: false }],
      education: [],
      skills: [],
    };
  };
  const extractFromGlassdoor = () => {
    const title = document.querySelector('[data-test="job-title"], h1') || null;
    const company = document.querySelector('[data-test="job-company-name"], .css-17x75b3.e1tk4kwz4, .css-87uc0g') || null;
    const description = document.querySelector('[data-test="jobDescription"], .jobDescriptionContent') || null;
    const locationEl = document.querySelector('[data-test="job-location"]') || null;
    return {
      personalInfo: { fullName: '', title: extractText(title) || '', email: '', phone: '', location: extractText(locationEl) || '', linkedin: '', summary: '' },
      experience: [{ id: `gd-${Date.now()}`, company: extractText(company) || '', position: extractText(title) || '', startDate: '', endDate: '', description: limit(extractText(description) || ''), isOptimized: false }],
      education: [],
      skills: [],
    };
  };
  const extractFromLever = () => {
    const title = document.querySelector('.posting-headline h2') || document.querySelector('h1') || null;
    const company = document.querySelector('.posting-headline h3') || null;
    const description = document.querySelector('.posting-description') || null;
    const locationEl = document.querySelector('.location') || null;
    return {
      personalInfo: { fullName: '', title: extractText(title) || '', email: '', phone: '', location: extractText(locationEl) || '', linkedin: '', summary: '' },
      experience: [{ id: `lever-${Date.now()}`, company: extractText(company) || '', position: extractText(title) || '', startDate: '', endDate: '', description: limit(extractText(description) || ''), isOptimized: false }],
      education: [],
      skills: [],
    };
  };
  const extractFromGreenhouse = () => {
    const title = document.querySelector('.app-title') || document.querySelector('h1') || null;
    const company = document.querySelector('.company-name, .app-logo img[alt]') || null;
    const description = document.querySelector('#content, .opening, .job-posting') || null;
    const locationEl = document.querySelector('.location') || null;
    return {
      personalInfo: { fullName: '', title: extractText(title) || '', email: '', phone: '', location: extractText(locationEl) || '', linkedin: '', summary: '' },
      experience: [{ id: `gh-${Date.now()}`, company: extractText(company) || '', position: extractText(title) || '', startDate: '', endDate: '', description: limit(extractText(description) || ''), isOptimized: false }],
      education: [],
      skills: [],
    };
  };
  const extractFromJobPage = () => {
    const title =
      document.querySelector('[data-test="job-title"], .job-details__title, .topcard__title, h1') || null;
    const company =
      document.querySelector('[data-test="job-company-name"], .topcard__org-name-link, .job-details__company') || null;
    const description =
      document.querySelector('[data-test="job-description"], .jobs-description, .job-description, [class*="description"]') || null;
    const locationEl =
      document.querySelector('[data-test="job-location"], .topcard__flavor--bullet, .job-location') || null;

    return {
      personalInfo: {
        fullName: '',
        title: extractText(title) || '',
        email: '',
        phone: '',
        location: extractText(locationEl) || '',
        linkedin: '',
        summary: '',
      },
      experience: [
        {
          id: `job-${Date.now()}`,
          company: extractText(company) || '',
          position: extractText(title) || '',
          startDate: '',
          endDate: '',
          description: limit(extractText(description) || document.body.innerText.trim()),
          isOptimized: false,
        },
      ],
      education: [],
      skills: [],
    };
  };

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === 'resumeai_extract') {
      try {
        let data = null;
        const href = location.href;
        if (/linkedin\.com\/in\//.test(href)) {
          data = extractFromLinkedIn();
        } else if (/indeed\.com/.test(href)) {
          data = extractFromIndeed();
        } else if (/glassdoor\.com/.test(href)) {
          data = extractFromGlassdoor();
        } else if (/lever\.co/.test(href)) {
          data = extractFromLever();
        } else if (/greenhouse\.io/.test(href)) {
          data = extractFromGreenhouse();
        } else if (/linkedin\.com\/jobs/.test(href)) {
          data = extractFromJobPage();
        } else {
          const txt = limit(document.body.innerText.trim());
          data = {
            personalInfo: { fullName: '', title: '', email: '', phone: '', location: '', linkedin: '', summary: '' },
            experience: [{ id: `gen-${Date.now()}`, company: '', position: '', startDate: '', endDate: '', description: txt, isOptimized: false }],
            education: [],
            skills: [],
          };
        }
        sendResponse({ ok: true, data });
      } catch (e) {
        sendResponse({ ok: false, error: String(e) });
      }
      return true;
    }
    if (msg?.type === 'resumeai_inject' && isResumeEditor) {
      try {
        sendToPage(msg.payload);
        sendResponse({ ok: true });
      } catch (e) {
        sendResponse({ ok: false, error: String(e) });
      }
      return true;
    }
  });
})();
