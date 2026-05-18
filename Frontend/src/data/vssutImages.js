/**
 * Official VSSUT campus imagery (vssut.ac.in, cse.vssut.ac.in).
 * Files in /public/images/vssut/ — sourced from university sites.
 */

const base = '/images/vssut';

export const vssutCampusCategories = [
  {
    id: 'vssut-cse-highlights',
    title: 'VSSUT Gate & CSE Building',
    description: 'Focused highlights from VSSUT Burla: the main gate and CSE department premises.',
    images: [
      {
        src: `${base}/curated_images/vssut-main-gate.jpg`,
        alt: 'Main gate of VSSUT Burla',
      },
      {
        src: `${base}/campus-building.jpg`,
        alt: 'CSE department building at VSSUT Burla',
      },
      {
        src: `${base}/curated_images/cse-building-wing.jpg`,
        alt: 'CSE department block facade, VSSUT Burla',
      },
    ],
  },
];

/** Flat list for scrolling gallery / carousels */
export const vssutCampusImages = vssutCampusCategories.flatMap((cat) =>
  cat.images.map((img) => ({
    ...img,
    category: cat.title,
  }))
);

export const vssutHeroImage = {
  src: `${base}/campus-building.jpg`,
  alt: 'Department of Computer Science & Engineering, VSSUT Burla',
};
