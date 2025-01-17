import { Meta } from '@storybook/react';
import { useState, useEffect } from 'react';

import { Axis, LineSeries, Plot, Heading, SeriesPoint } from '../../src';
import srcData from '../data/nasdaq.json';
import { DEFAULT_PLOT_CONFIG } from '../utils';

export default {
  title: 'Examples/Nasdaq',
  args: {
    refreshFrequency: 1,
    step: 1,
    displayInterval: 500,
  },
} as Meta;

/** Util functions *****************/

const generateNewXY = (serie: SeriesPoint, step: number): [number, number] => {
  const x = serie.x + step;
  const rand = Math.floor(Math.random() * 10);
  const y = rand % 2 === 0 ? serie.y + rand * 0.1 : serie.y - rand * 0.1; // generate a new Y by + or - a random value to the last point.y
  return [x, y];
};

const getLastData = (
  data: Array<SeriesPoint>,
  displayInterval: number,
): Array<SeriesPoint> => {
  const lastTimestamp = data[data.length - 1].x;
  const firstIndex = data.findIndex(
    (serie) => serie.x >= lastTimestamp - displayInterval,
  );
  const newVals = data.slice(firstIndex);
  return newVals;
};

/** Main Component *****************/

type Props = Record<string, number>;
export function NasdaqExample(props: Props) {
  const {
    refreshFrequency, // Page refresher frequency (s)
    step, // timestamp's step
    displayInterval, // interval to display (s)
  } = props;

  function PlotRefresher() {
    const [data, setData] = useState(srcData);

    useEffect(() => {
      const timer = setTimeout(() => {
        const [x, y] = generateNewXY(data[data.length - 1], step); // generate a new coordinates
        const newData = getLastData([...data, { x, y }], displayInterval); // get last 500s data
        setData(newData);
      }, refreshFrequency * 1000);
      return () => clearTimeout(timer);
    }, [data]);
    //const timeFormat = new Intl.DateTimeFormat('en-GB', { timeStyle: 'short' });
    return (
      <Plot {...DEFAULT_PLOT_CONFIG}>
        <Heading title="Nasdaq values Simulation" />
        <LineSeries
          data={data.map(({ x, y }) => ({ x: x * 1000, y }))}
          xAxis="x"
          yAxis="y"
          lineStyle={{ stroke: 'green', strokeWidth: 1.5 }}
        />
        <Axis id="x" position="bottom" label="Time (hh:mm)" scale="time" />
        <Axis
          id="y"
          position="left"
          label="Nasdaq value [USD]"
          displayPrimaryGridLines
          paddingStart="10%"
          paddingEnd="10%"
        />
      </Plot>
    );
  }
  return <PlotRefresher />;
}
