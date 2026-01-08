export function deriveFeedState(events = []) {
  return {
    events: [...events].reverse(), // newest on top
    isEmpty: events.length === 0,
  };
}
