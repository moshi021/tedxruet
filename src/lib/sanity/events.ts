import { client } from "./index";
import type { LastEventData, LatestEventData } from "../types";

export const getLastEvent = () => {
  return client.fetch<LastEventData>(
    `*[_type=='event'] | order(_createdAt desc)[0] {
        title,
        'slug': @['slug'].current,
        'speakers': speakers[] -> {
            name, 
            designation,
            'slug':slug.current,
            'photoUrl':photo.asset->url
          },
        'members': members[]{
            post, 
            'slug': @.member->slug.current,
            'name': @.member->name, 
            'photoUrl':@.member->photo.asset->url
          },
        'sponsors': sponsors[]{
            type, 
            'slug': @.partner->slug.current, 
            'name': @.partner->name, 
            'logoUrl':@.partner->logo.asset->url 
          },
      }`
  );
};

export const getEvents = async (from = 0, to = 2) => {
  return client.fetch<Array<LatestEventData>>(
    `
  *[_type=='event'] | order(_createdAt desc)[$from...$to] {
    title,
    preamble,
    'slug': @['slug'].current,
    'coverUrl': @['cover'].asset->url
  }
  `,
    { from, to }
  );
};

export const getEvent = (slug = "") => {
  return client.fetch(
    `
  *[_type=='event' && slug.current==$slug][0] {
    title,
    'slug': @['slug'].current,
    'speakers': speakers[] -> {
        name, 
        designation,
        'slug':slug.current,
        'photoUrl':photo.asset->url
      },
    'members': members[]{
        post, 
        'slug': @.member->slug.current,
        'name': @.member->name, 
        'photoUrl':@.member->photo.asset->url
      },
    'sponsors': sponsors[]{
        type, 
        'slug': @.partner->slug.current, 
        'name': @.partner->name, 
        'logoUrl':@.partner->logo.asset->url 
      },
  }
  `,
    { slug }
  );
};