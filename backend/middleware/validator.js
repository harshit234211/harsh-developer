const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  // Allows optional +, numbers, spaces, dashes, parentheses. Min 7 digits.
  const digits = String(phone).replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

const validateUrl = (str) => {
  if (!str || str.trim() === '') return true;
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
};

const sanitize = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};

const validateEnquiry = (req, res, next) => {
  let { name, email, phone, whatsapp, service, budget, projectType, deadline, description, message, referenceUrl } = req.body;

  const errors = [];

  name = sanitize(name);
  email = sanitize(email);
  phone = sanitize(phone);
  whatsapp = sanitize(whatsapp);
  service = sanitize(service);
  budget = sanitize(budget);
  projectType = sanitize(projectType);
  deadline = sanitize(deadline);
  description = sanitize(description);
  message = sanitize(message);
  referenceUrl = sanitize(referenceUrl);

  if (!name || name.length < 2) {
    errors.push('Name must be at least 2 characters long.');
  }

  if (!email || !validateEmail(email)) {
    errors.push('A valid email address is required.');
  }

  if (!phone || !validatePhone(phone)) {
    errors.push('A valid contact phone number is required (min 7 digits).');
  }

  if (!service || service.trim() === '') {
    errors.push('Please select a service category.');
  }

  if (!description || description.length < 10) {
    errors.push('Project description must be at least 10 characters long.');
  }

  if (referenceUrl && !validateUrl(referenceUrl)) {
    errors.push('Reference URL must be a valid URL (including http:// or https://).');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors
    });
  }

  req.body = {
    name,
    email,
    phone,
    whatsapp: whatsapp || phone,
    service,
    budget: budget || 'Flexible',
    projectType: projectType || 'New Project',
    deadline: deadline || 'Flexible',
    description,
    message: message || '',
    referenceUrl: referenceUrl || ''
  };

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  if (!password || password.trim().length < 4) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 4 characters long.'
    });
  }

  next();
};

const validateProject = (req, res, next) => {
  let { name, description, category, technologies, image, liveDemoUrl, githubUrl, status, featured, isPublished } = req.body;

  const isUpdate = req.method === 'PUT' || req.method === 'PATCH';

  if (!isUpdate) {
    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Project name must be at least 2 characters long.' });
    }
    if (!description || String(description).trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Project description must be at least 10 characters long.' });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }
  } else {
    if (name !== undefined && String(name).trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Project name must be at least 2 characters long.' });
    }
    if (description !== undefined && String(description).trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Project description must be at least 10 characters long.' });
    }
  }

  // Format technologies array
  let techArray;
  if (technologies !== undefined) {
    if (Array.isArray(technologies)) {
      techArray = technologies.map(t => sanitize(String(t))).filter(Boolean);
    } else if (typeof technologies === 'string') {
      techArray = technologies.split(',').map(t => sanitize(t)).filter(Boolean);
    }
  }

  const cleaned = {};
  if (name !== undefined) cleaned.name = sanitize(name);
  if (description !== undefined) cleaned.description = sanitize(description);
  if (category !== undefined) cleaned.category = sanitize(category);
  if (techArray !== undefined) cleaned.technologies = techArray;
  if (image !== undefined) cleaned.image = image || '/assets/images/project-placeholder.svg';
  if (liveDemoUrl !== undefined) cleaned.liveDemoUrl = liveDemoUrl || '';
  if (githubUrl !== undefined) cleaned.githubUrl = githubUrl || 'Coming Soon';
  if (status !== undefined) cleaned.status = status || 'Showcase Demo';
  if (featured !== undefined) cleaned.featured = Boolean(featured);
  if (isPublished !== undefined) cleaned.isPublished = Boolean(isPublished);

  if (!isUpdate) {
    cleaned.technologies = cleaned.technologies || [];
    cleaned.image = cleaned.image || '/assets/images/project-placeholder.svg';
    cleaned.liveDemoUrl = cleaned.liveDemoUrl || '';
    cleaned.githubUrl = cleaned.githubUrl || 'Coming Soon';
    cleaned.status = cleaned.status || 'Showcase Demo';
    cleaned.featured = Boolean(cleaned.featured);
    cleaned.isPublished = cleaned.isPublished !== undefined ? Boolean(cleaned.isPublished) : true;
  }

  req.body = cleaned;
  next();
};

module.exports = {
  validateEnquiry,
  validateLogin,
  validateProject
};
