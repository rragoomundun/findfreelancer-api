const isFreelancerPublic = (freelancer) => {
  return (
    freelancer.location &&
    freelancer.location.town &&
    freelancer.location.countryCode &&
    freelancer.hourlyRate &&
    freelancer.title &&
    freelancer.presentationText &&
    freelancer.contact &&
    (freelancer.contact.email || freelancer.contact.phone)
  );
};

export { isFreelancerPublic };
