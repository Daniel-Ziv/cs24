import contributors from '../data/contributors';

/**
 * Fetches LinkedIn profile data
 * 
 * @param {string} linkedinUrl - LinkedIn profile URL
 * @returns {Promise<Object>} - Profile data including image URL
 */
export const fetchLinkedInProfileData = async (linkedinUrl) => {
  try {
    // Find the contributor data from our local dataset
    const contributor = contributors.find(c => c.linkedinUrl === linkedinUrl);
    
    if (!contributor) {
      throw new Error('LinkedIn profile not found');
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      name: contributor.name,
      imageUrl: contributor.imageUrl, // Use the image URL directly from the data
      position: contributor.position
    };
  } catch (error) {
    console.error('Error fetching LinkedIn profile:', error);
    // Return a default image if fetching fails
    return {
      name: 'Unknown',
      imageUrl: 'https://i.pravatar.cc/150?img=0',
      position: ''
    };
  }
};

/**
 * Fetches all contributor profile data
 * 
 * @returns {Promise<Array>} - Array of contributor profile data
 */
export const fetchAllContributorProfiles = async () => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return the contributors data directly
    return contributors.map(contributor => ({
      id: contributor.id,
      name: contributor.name,
      imageUrl: contributor.imageUrl,
      linkedinUrl: contributor.linkedinUrl,
      position: contributor.position
    }));
  } catch (error) {
    console.error('Error fetching contributor profiles:', error);
    return [];
  }
};
