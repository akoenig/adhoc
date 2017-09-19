/*
 * @akoenig/adhoc
 *
 * Copyright(c) 2017 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

/**
 * @author André König <andre.koenig@gmail.com>
 *
 */

import xs from "xstream";
import {
  compose,
  lifecycle,
  withProps,
  withState,
  setDisplayName
} from "recompose";

const withStreams = (blueprints, test = false) => {
  let dispatcher;

  const propPrefix = `${test ? "data-" : ""}`;

  const producer = {
    start: listener => (dispatcher = value => listener.next(value)),
    stop: () => (dispatcher = null)
  };

  const uberStream = xs.create(producer);

  //
  // Use the names of the stream creator identifiers
  // as prop names.
  //
  const streamNames = Object.keys(blueprints);

  const withStates = streamNames.map(streamName =>
    withState(`${propPrefix}${streamName}`, `${propPrefix}set${streamName}`, "")
  );

  const dispatch = action => dispatcher(action);

  return compose(
    setDisplayName("withStreams"),
    ...withStates,
    withProps({
      [`${propPrefix}dispatch`]: dispatch
    }),
    lifecycle({
      componentDidMount() {
        //
        // Activate each stream, pass the own props and subscribe to changes
        // so that the respective props gets updated.
        //
        streamNames
          .map(streamName => ({
            name: streamName,
            stream: blueprints[streamName]
          }))
          .forEach(({ name, stream }) =>
            stream(uberStream, this.props).subscribe({
              next: value => this.props[`${propPrefix}set${name}`](value)
            })
          );
      }
    })
  );
};

export { withStreams };
