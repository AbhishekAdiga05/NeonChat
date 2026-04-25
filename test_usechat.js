const React = require('react');
const { useChat } = require('@ai-sdk/react');

// Mock useState and other hooks so useChat doesn't crash immediately when called outside a component
React.useState = (init) => [init, () => {}];
React.useRef = () => ({ current: null });
React.useEffect = () => {};
React.useCallback = (fn) => fn;
React.useMemo = (fn) => fn();
React.useId = () => "id";

try {
  const result = useChat({});
  console.log(Object.keys(result));
} catch (e) {
  console.error("Error calling useChat:", e.message);
}
