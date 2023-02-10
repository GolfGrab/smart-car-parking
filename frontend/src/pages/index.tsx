import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import FloorSelection from "../components/FloorSelection";
import ParkingMap from "../components/ParkingMap";
import ParkingStatus from "../components/ParkingStatus";
import { carParkingsMockEmpty } from "../mock/carParkingsMock";
import type { CountData, ParkingArray } from "../types/car";

const Home: NextPage = () => {
  const [floor, setFloor] = useState(1);
  const [parkData, setParkData] = useState<ParkingArray>(carParkingsMockEmpty);
  const [countData, setCountData] = useState<CountData[]>();

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("https://ecourse.cpe.ku.ac.th/exceed16/get-parking-id/")
        .then((res) => res.json())
        .then((data: { cars: ParkingArray }) => {
          setParkData(data.cars);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);

    const interval2 = setInterval(() => {
      fetch("https://ecourse.cpe.ku.ac.th/exceed16/get-parking-floor/")
        .then((res) => res.json())
        .then((data: { floors: CountData[] }) => {
          setCountData(data.floors);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Smart Car Parking</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-row">
        {/* floor selection */}
        <FloorSelection floor={floor} setFloor={setFloor} />

        <div className="relative flex h-full w-full flex-col justify-between">
          {/* parking map  */}

          <ParkingMap
            carParkings={parkData.filter(
              (lot) => lot?.floor === floor.toString()
            )}
          />
          {/* parking text status */}
          <ParkingStatus
            carParkingRemain={
              (countData?.find((item) => item.floor === floor.toString())
                ?.remaining_parking || 0) <= 0
                ? 0
                : countData?.find((item) => item.floor === floor.toString())
                    ?.remaining_parking || 0
            }
            carRunning={
              countData?.find((item) => item.floor === floor.toString())
                ?.running_count || 0 <= 0
                ? 0
                : countData?.find((item) => item.floor === floor.toString())
                    ?.running_count || 0
            }
          />
          {/* overlay banner show full */}
          {(countData?.find((item) => item.floor === floor.toString())
            ?.remaining_parking ?? 1) <= 0 && (
            <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
              <div className="rounded-lg bg-white p-4 text-center">
                <h1 className="text-8xl font-bold text-red-500">
                  Parking Full
                </h1>
                <p className="pt-10 text-3xl font-semibold">
                  Please go to another floor
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
