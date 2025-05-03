import "./App.css";
import useDometerStore from "./store";
import { useShallow } from "zustand/react/shallow";

function App() {
  const [startTime, isDoing, doTimes, startDoing, endDoing, deleteDoTimes] =
    useDometerStore(
      useShallow((state) => [
        state.startTime,
        state.isDoing,
        state.doTimes,
        state.startDoing,
        state.endDoing,
        state.deleteDoTimes,
      ])
    );

  const handleSwitchDoing = () => {
    if (isDoing) endDoing();
    else startDoing();
  };

  const handleDeleteDoTimes = () => {
    if (confirm("Delete all times?")) deleteDoTimes();
  };

  const reverseDoTimes = [...doTimes].reverse();
  const summTimes = doTimes.reduce((acc, a) => {
    return acc + Math.ceil((a[1] - a[0]) / 1000);
  }, 0);
  return (
    <>
      <h1>DoMeter</h1>
      <div className='switch'>
        <button
          className='switch-doing'
          data-is-doing={isDoing ? "is-doing" : ""}
          onClick={handleSwitchDoing}
        >
          {isDoing ? "let's Rest" : "to Do!"}
        </button>
      </div>
      {isDoing ? <div className='doing-blinker'>is doing!</div> : null}
      {startTime ? (
        <div className='start-time'>{new Date(startTime).toLocaleString()}</div>
      ) : null}
      {summTimes ? (
        <div className='summ-times'>
          sum = {summTimes} sec ~ {Math.round(summTimes / 60)} min ~{" "}
          {Math.round(summTimes / (60 * 60))} h
        </div>
      ) : null}
      <div className='do-times'>
        <div className='do-times-part'>
          <div>times</div>
          <div>
            <div>start</div>
          </div>
          <div>
            <div>end</div>
          </div>
        </div>
        {reverseDoTimes.map((times, i) => {
          const sec = Math.ceil((times[1] - times[0]) / 1000);
          const dateTime1 = new Date(times[0]).toLocaleString().split(",");
          const dateTime2 = new Date(times[1]).toLocaleString().split(",");
          return (
            <div className='do-times-part' key={i}>
              <div>{sec}</div>
              <div>
                <div>{dateTime1[0]}</div>
                <div>{dateTime1[1]}</div>
              </div>
              <div>
                <div>{dateTime2[0]}</div>
                <div>{dateTime2[1]}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <button className='delete-times' onClick={handleDeleteDoTimes}>
          DELETE ALL TIMES
        </button>
      </div>
    </>
  );
}

export default App;
