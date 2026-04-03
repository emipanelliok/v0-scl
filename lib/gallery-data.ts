export type GalleryItem = {
  src: string
  type: "image" | "video"
}

// All media filenames from /public/img, sorted chronologically
const imageNames = [
  "IMG_4303","IMG_4307","IMG_4308","IMG_4310","IMG_4311",
  "IMG_4319","IMG_4334","IMG_4335","IMG_4336","IMG_4337",
  "IMG_4338","IMG_4339","IMG_4356","IMG_4357","IMG_4358",
  "IMG_4364","IMG_4365","IMG_4368","IMG_4371","IMG_4372",
  "IMG_4373","IMG_4374","IMG_4402","IMG_4403","IMG_4404",
  "IMG_4405","IMG_4406","IMG_4407","IMG_4408","IMG_4409",
  "IMG_4410","IMG_4413","IMG_4414","IMG_4415","IMG_4416",
  "IMG_4422","IMG_4423","IMG_4424","IMG_4425","IMG_4427",
  "IMG_4428","IMG_4429","IMG_4436","IMG_4438","IMG_4439",
  "IMG_4463","IMG_4464","IMG_4468","IMG_4469","IMG_4470",
  "IMG_4471","IMG_4472","IMG_4473","IMG_4474","IMG_4477",
  "IMG_4478","IMG_4479","IMG_4480","IMG_4481","IMG_4487",
  "IMG_4488","IMG_4489","IMG_4490","IMG_4491","IMG_4492",
  "IMG_4493","IMG_4494","IMG_4495","IMG_4496","IMG_4497",
  "IMG_4499","IMG_4500",
]

const videoEntries: { name: string; sortKey: string }[] = [
  { name: "IMG_4312", sortKey: "IMG_4312" },
  { name: "IMG_4501", sortKey: "IMG_4501" },
  { name: "IMG_4502", sortKey: "IMG_4502" },
  { name: "IMG_4503", sortKey: "IMG_4503" },
  { name: "IMG_4504", sortKey: "IMG_4504a" },
  { name: "IMG_4504(1)", sortKey: "IMG_4504b" },
  { name: "IMG_4504(2)", sortKey: "IMG_4504c" },
  { name: "IMG_4505", sortKey: "IMG_4505" },
]

type SortableItem = GalleryItem & { sortKey: string }

const allItems: SortableItem[] = [
  ...imageNames.map((name) => ({
    src: `/img/${name}-branded.webp`,
    type: "image" as const,
    sortKey: name,
  })),
  // TODO: Add videos back in
  // ...videoEntries.map((entry) => ({
  //   src: `/img/${entry.name}-branded.mp4`,
  //   type: "video" as const,
  //   sortKey: entry.sortKey,
  // })),
]

allItems.sort((a, b) => a.sortKey.localeCompare(b.sortKey))

export const galleryItems: GalleryItem[] = allItems.map(({ src, type }) => ({
  src,
  type,
}))
