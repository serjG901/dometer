import { useEffect, useState } from "react";
import "./App.css";
import useDometerStore from "./store/store";
import { useShallow } from "zustand/react/shallow";
import Logo from "./assets/logo512.png";
import PWABadge from "./PWABadge";
import InputWithOptions from "./input-with-options/InputWithOptions";
import Checked from "./checked/Checked";

function App() {
  const [isFiltred, setIsFiltred] = useState(false);

  const [timer, setTimer] = useState(0);

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

  const displayingDoTimes = isFiltred
    ? reverseDoTimes.filter((t) => t.type === type)
    : reverseDoTimes;

  const allDoByType = Object.groupBy(displayingDoTimes, ({ type }) => type);

  useEffect(() => {
    let timer = 0;
    if (isDoing) {
      setTimer(Date.now());
      timer = setInterval(() => setTimer(Date.now()), 30 * 1000);
    } else {
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isDoing]);

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
            "Stop"
          ) : (
            <>
              Start <span>{type}</span>
            </>
          )}
        </button>
      </div>

      {isDoing ? (
        <div className='doing-blinker'>
          <span>{type ? type : "doing something"}</span>
        </div>
      ) : (
        <div className='resting'>just resting</div>
      )}

      <div className='start-time'>
        {startTime
          ? `started at ${new Date(startTime)
              .toLocaleString()
              .split(",")
              .reverse()
              .join(" ")}, spend ~ ${Math.round(
              (timer - startTime) / (1000 * 60)
            )} min`
          : "..."}
      </div>

      {Object.keys(allDoByType).length ? (
        <div className='sum-times'>
          <div className='table'>
            <div className='row'>
              <div>type</div>
              <div>current sum</div>
            </div>
            {Object.keys(allDoByType).map((key) => {
              const currentDay = new Date(Date.now())
                .toISOString()
                .slice(0, 10);
              const currentMounth = currentDay.slice(0, 7);
              const sum = allDoByType[key]!.reduce(
                (acc, a) => {
                  const aStartDay = new Date(a.start)
                    .toISOString()
                    .slice(0, 10);
                  const aStartMounth = aStartDay.slice(0, 7);

                  if (aStartDay === currentDay) {
                    acc[0] += Math.ceil((a.end - a.start) / 1000);
                  }
                  if (aStartMounth === currentMounth) {
                    acc[1] += Math.ceil((a.end - a.start) / 1000);
                  }
                  return acc;
                },
                [0, 0]
              );
              return (
                <div className='row'>
                  <div>
                    <button disabled={isDoing} onClick={() => setType(key)}>
                      {key}
                    </button>
                  </div>
                  <div className='text-left'>
                    <div>
                      <div className='gray'>{currentDay}:</div>
                      <div>
                        {sum[0]}s ~{Math.round(sum[0] / 60)}m ~
                        {Math.round(sum[0] / (60 * 60))}h
                      </div>
                    </div>
                    <div>
                      <div className='gray'>{currentMounth}:</div>
                      <div>
                        {sum[1]}s ~{Math.round(sum[1] / 60)}m ~
                        {Math.round(sum[1] / (60 * 60))}h
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {displayingDoTimes.length ? (
        <div className='do-times'>
          <div className='table'>
            <div className='row'>
              <div>type</div>
              <div>start</div>
              <div>time</div>
              <div>stop</div>
            </div>
            {displayingDoTimes.map((time, i) => {
              const sec = Math.ceil((time.end - time.start) / 1000);
              const dateTime1 = new Date(time.start)
                .toLocaleString()
                .split(",");
              const dateTime2 = new Date(time.end).toLocaleString().split(",");
              return (
                <div className='row' key={i}>
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
        </div>
      ) : null}

      {reverseDoTimes.length ? (
        <div>
          <button
            className='delete-times'
            disabled={isDoing}
            onClick={handleDeleteDoTimes}
          >
            DELETE {type ? <span>{type}</span> : "ALL"} TIMES
          </button>
        </div>
      ) : null}

      <PWABadge />
    </>
  );
}

export default App;
