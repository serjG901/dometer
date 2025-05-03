import "./App.css";
import useDometerStore from "./store";
import { useShallow } from "zustand/react/shallow";
import Logo from "./assets/logo.png";
import PWABadge from "./PWABadge";

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
    if (isDoing) {
      window.navigator.vibrate([100, 50, 100]);
      endDoing();
    } else {
      window.navigator.vibrate([100]);
      startDoing();
    }
  };

  const handleDeleteDoTimes = () => {
    window.navigator.vibrate([100]);
    if (confirm("Delete all times?")) {
      window.navigator.vibrate([100, 50, 100]);
      deleteDoTimes();
    }
  };

  const reverseDoTimes = [...doTimes].reverse();
  const summTimes = doTimes.reduce((acc, a) => {
    return acc + Math.ceil((a[1] - a[0]) / 1000);
  }, 0);
  return (
    <>
      <div>
        <img src={Logo} width={64} height={64} />
      </div>
      <h1>dometer</h1>
      <div className='switch'>
        <button
          className='switch-doing'
          data-is-doing={isDoing ? "is-doing" : ""}
          onClick={handleSwitchDoing}
        >
          {isDoing ? "let's rest" : "let's do!"}
        </button>
      </div>
      {isDoing ? (
        <div className='doing-blinker'>is doing!</div>
      ) : (
        <div className='resting'>is resting</div>
      )}

      <div className='start-time'>
        {startTime
          ? "started at " +
            new Date(startTime).toLocaleString().split(",").reverse().join(" ")
          : "..."}
      </div>

      {summTimes ? (
        <div className='sum-times'>
          sum = {summTimes} sec ~ {Math.round(summTimes / 60)} min ~{" "}
          {Math.round(summTimes / (60 * 60))} h
        </div>
      ) : null}
      {reverseDoTimes.length ? (
        <div className='do-times'>
          <div className='do-times-part'>
            <div>start</div>
            <div>time</div>
            <div>end</div>
          </div>
          {reverseDoTimes.map((times, i) => {
            const sec = Math.ceil((times[1] - times[0]) / 1000);
            const dateTime1 = new Date(times[0]).toLocaleString().split(",");
            const dateTime2 = new Date(times[1]).toLocaleString().split(",");
            return (
              <div className='do-times-part' key={i}>
                <div>
                  <div>{dateTime1[0]}</div>
                  <div>{dateTime1[1]}</div>
                </div>
                <div>
                  <div>{sec} sec</div>
                  <div>~{Math.round(sec / 60)} min</div>
                </div>
                <div>
                  <div>{dateTime2[0]}</div>
                  <div>{dateTime2[1]}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {reverseDoTimes.length ? (
        <div>
          <button className='delete-times' onClick={handleDeleteDoTimes}>
            DELETE ALL TIMES
          </button>
        </div>
      ) : null}
      <PWABadge />
    </>
  );
}

export default App;
