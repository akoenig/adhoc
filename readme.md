# adhoc

Opinionated higher-order component for establishing ad-hoc stream-based unidirectional data flows.

[Demo](https://stackblitz.com/edit/react-dcxk1g)

## Example

```jsx
import React from "react";
import { compose, withHandlers } from "recompose";

import { withStreams } from "@akoenig/adhoc";

const SearchBoxComponent = ({query, placeholder, onChange}) => (
  <input
    placeholder={placeholder}
    value={query}
    type="text"
    onChange={onChange}
  />
);

const SearchBox = compose(
  withStreams({
    query: (stream, ownProps) => stream.fold((state, action) => action.payload, ""),
  }),
  withHandlers({
    onChange: ({ dispatch }) => e => dispatch("CHANGE_QUERY", e.target.value)
  })
)(SearchBoxComponent)

export { SearchBox };
```

## Motivation

For me, [Redux](https://redux.js.org) is still the number one choice when it comes to selecting a global state container for scalable applications and I recommended it a lot to my customers. Many of the use-cases out there can be covered with this stack quite well. Even when this technology stack is still popular, I made an interesting observation in my last projects. Recently, I developed a GraphQL API and the corresponding client application with React + [Apollo](http://dev.apollodata.com/). Everything fitted nicely due to the declarative nature of GraphQL. Anyways, mapping queries and mutations to UI components is cool, but having UI state is of course still real. Therefore, what to do in this case? Sharing the Redux store with Apollo? Well, you can do that. I had different goals in mind:

  * Lightweight solution without a lot of boilerplate
  * Reactive (❤️ `RxJS` & `xstream`)
  * Fast implementation iterations when you have to deal with local UI state

The result is this higher-order component which allows you to establish ad-hoc stream-based unidirectional data flows. Let's examine one typical use-case:

> I want to have a search box which handles the user input by 1.) storing the current value, 2.) checking if the user entered at least three characters and 3.) there should not be any interaction in the last 500 ms before sending the query to the backend system.

`Functional Reactive Programming` is one of the best paradigms for handling scenarios like that. Achieving a solution for that use-case above can be express with [xstream](https://github.com/staltz/xstream) – a functional reactive stream library – as:

```js
import debounce from "xstream/extra/debounce";
import fromEvent from "xstream/extra/fromEvent";

const stream = fromEvent(document.getElementById('search'), 'keyup')
  .map(e => e.currentTarget.value)
  .filter(value => value.length > 3)
  .compose(debounce(500))
  .subscribe({
      next: (value) => console.log(`Received debounced search query: ${value}`)
  });
```

Lovely, isn't it? `adhoc` helps you to do exactly that within your React components.

## API

### `withStreams()`

```js
withStreams({
  streamCreators: {
      [streamName: string]: (stream: Stream, props: Object) => Stream
  }
}),
```

Each last value of the stream will be mapped and passed as `prop` to the component. The `streamName` defines the name of the `prop`. The HoC will create one dedicated stream for the respective component, but you can define as much stream creators as you want. Those stream creators can be seen as "substreams" of the "über-stream". The underlying stream foundation is [xstream](https://github.com/staltz/xstream).

## License

MIT © [André König](http://andrekoenig.de)

