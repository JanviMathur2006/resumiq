export default function useResumeUndo(version, setVersion) {
  const saveSnapshot = (data) => {
    setVersion(prev => ({
      ...prev,
      history: [...prev.history, prev.data],
      data,
    }));
  };

  const undo = () => {
    setVersion(prev => {
      if (!prev.history.length) return prev;

      const last = prev.history[prev.history.length - 1];
      return {
        ...prev,
        data: last,
        history: prev.history.slice(0, -1),
      };
    });
  };

  return { saveSnapshot, undo };
}
