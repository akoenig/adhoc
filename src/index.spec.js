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

import React from "react";
import { compose } from "recompose";
import { shallow, mount } from "enzyme";

import { withStreams } from ".";

test("withStreams should have the proper display name", () => {
  const Probe = withStreams({}, true)("div");

  expect(Probe.displayName).toBe("withStreams");
});

test("withStreams passes additional props to base component", async () => {
  const Probe = withStreams(
    {
      test: (stream, ownProps) => stream
    },
    true
  )("div");

  const div = mount(React.createElement(Probe)).find("div");

  expect(div.prop("data-test")).toBe("");
  expect(typeof div.prop("data-dispatch")).toBe("function");
});

test("withStreams passes additional props to base component with populated value from stream", async () => {
  const Probe = withStreams(
    {
      test: (stream, ownProps) => stream.startWith("Boom!")
    },
    true
  )("div");

  const div = mount(React.createElement(Probe)).find("div");

  expect(div.prop("data-test")).toBe("Boom!");
});
