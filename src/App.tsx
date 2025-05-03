import { useState } from "react";
import "./App.css";
import useDometerStore from "./store";
import { useShallow } from "zustand/react/shallow";
import Logo from "./assets/logo.png";
import PWABadge from "./PWABadge";
import InputWithOptions from "./input-with-options/InputWithOptions";
import Checked from "./checked/Checked";

function App() {
  const [isFiltred, setIsFiltred] = useState(false);

  const [
    type,
    startTime,
    isDoing,
    doTimes,
    setType,
    startDoing,
    endDoing,
    deleteDoTimes,
  ] = useDometerStore(
    useShallow((state) => [
      state.type,
      state.startTime,
      state.isDoing,
      state.doTimes,
      state.setType,
      state.startDoing,
      state.endDoing,
      state.deleteDoTimes,
    ])
  );

  const handleSwitchDoing = () => {
    if (isDoing) {
      window.navigator.vibrate([300, 100, 300]);
      endDoing();
    } else {
      window.navigator.vibrate([300]);
      startDoing();
    }
  };

  const handleDeleteDoTimes = () => {
    if (confirm(`Delete ${type ? type : "ALL"} times?`)) {
      window.navigator.vibrate([300, 100, 300, 100, 300]);
      deleteDoTimes();
    }
  };

  const reverseDoTimes = [...doTimes].reverse();

  const displaingDoTimes = isFiltred
    ? reverseDoTimes.filter((t) => t.type === type)
    : reverseDoTimes;

  const summTimes = Object.groupBy(displaingDoTimes, ({ type }) => type);

  return (
    <>
      <div>
        <img src={Logo} width={64} height={64} />
      </div>

      <h1>dometer</h1>

      <InputWithOptions
        id='type-to-do'
        name='what to do'
        valueFromParent={type}
        disabled={isDoing}
        hoistValue={setType}
        options={Array.from(new Set(doTimes.map((t) => t.type)))}
      />

      <Checked
        id='is-filtred'
        name='apply filter'
        valueFromParent={isFiltred}
        hoistValue={setIsFiltred}
      />

      <div className='switch'>
        <button
          className='switch-doing'
          data-is-doing={isDoing ? "is-doing" : ""}
          onClick={handleSwitchDoing}
        >
          {isDoing ? (
            "let's rest"
          ) : (
            <>
              let's{" "}
              {type.search(/ing$/) !== -1 ? (
                <span>{type}</span>
              ) : (
                <>
                  doing <span>{type}</span>
                </>
              )}
            </>
          )}
        </button>
      </div>

      {isDoing ? (
        <div className='doing-blinker'>
          you are{" "}
          {type.search(/ing$/) !== -1 ? (
            <span>{type}</span>
          ) : (
            <>
              doing <span>{type}</span>
            </>
          )}
        </div>
      ) : (
        <div className='resting'>you are resting</div>
      )}

      <div className='start-time'>
        {startTime
          ? "started at " +
            new Date(startTime).toLocaleString().split(",").reverse().join(" ")
          : "..."}
      </div>

      {Object.keys(summTimes).length ? (
        <div className='sum-times'>
          <div className='sum-times-part'>
            <div>type</div>
            <div>sum</div>
          </div>
          {Object.keys(summTimes).map((key) => {
            const sum = summTimes[key]!.reduce(
              (acc, a) => acc + Math.ceil((a.end - a.start) / 1000),
              0
            );
            return (
              <div className='sum-times-part'>
                <div><button disabled={isDoing} onClick={()=>setType(key)}>{key}</button></div>
                <div>
                  {sum} sec ~ {Math.round(sum / 60)} min ~{" "}
                  {Math.round(sum / (60 * 60))} h
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {displaingDoTimes.length ? (
        <div className='do-times'>
          <div className='do-times-part'>
            <div>type</div>
            <div>start</div>
            <div>time</div>
            <div>end</div>
          </div>
          {displaingDoTimes.map((time, i) => {
            const sec = Math.ceil((time.end - time.start) / 1000);
            const dateTime1 = new Date(time.start).toLocaleString().split(",");
            const dateTime2 = new Date(time.end).toLocaleString().split(",");
            return (
              <div className='do-times-part' key={i}>
                <div>
                  <div>{time.type}</div>
                </div>
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
          <button className='delete-times' disabled={isDoing} onClick={handleDeleteDoTimes}>
            DELETE {type ? <span>{type}</span> : "ALL"} TIMES
          </button>
        </div>
      ) : null}

      <PWABadge />
    </>
  );
}

export default App;
