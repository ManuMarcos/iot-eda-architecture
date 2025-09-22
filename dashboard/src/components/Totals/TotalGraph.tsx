import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MyDatePicker } from '../DatePicker/DatePicker';



// total
// 97.20555929091596


const processData = [
  {
    sensor: "water",
    id: "w001",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-19 13:56:03.696Z",
    period: "2023-01",
    type: "totals",
    total: "7.12",
  },
  {
    sensor: "water",
    id: "w002",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-19 13:56:03.696Z",
    period: "2023-02",
    type: "totals",
    total: "8.65",
  },
  {
    sensor: "water",
    id: "w003",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-20 08:22:15.421Z",
    period: "2023-03",
    type: "totals",
    total: "9.23",
  },
  {
    sensor: "water",
    id: "w004",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-20 08:22:15.421Z",
    period: "2023-04",
    type: "totals",
    total: "10.12",
  },
  {
    sensor: "water",
    id: "w005",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-21 09:10:10.789Z",
    period: "2023-05",
    type: "totals",
    total: "11.45",
  },
  {
    sensor: "water",
    id: "w006",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-21 09:10:10.789Z",
    period: "2023-06",
    type: "totals",
    total: "12.34",
  },
  {
    sensor: "water",
    id: "w007",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-22 15:34:55.222Z",
    period: "2023-07",
    type: "totals",
    total: "13.25",
  },
  {
    sensor: "water",
    id: "w008",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-22 15:34:55.222Z",
    period: "2023-08",
    type: "totals",
    total: "14.78",
  },
  {
    sensor: "water",
    id: "w009",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-19 13:56:03.696Z",
    period: "2023-09",
    type: "totals",
    total: "15.12",
  },
  {
    sensor: "water",
    id: "w010",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-20 08:22:15.421Z",
    period: "2023-10",
    type: "totals",
    total: "16.45",
  },
  {
    sensor: "water",
    id: "w011",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-21 09:10:10.789Z",
    period: "2023-11",
    type: "totals",
    total: "17.78",
  },
  {
    sensor: "water",
    id: "w012",
    field: "junin",
    company: "la_rinconada",
    unit: "ml",
    filter: "accumulator",
    latestUpdate: "2025-09-22 15:34:55.222Z",
    period: "2023-12",
    type: "totals",
    total: "18.25",
  },
  {
    sensor: "energy",
    id: "e001",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-20 08:22:15.421Z",
    period: "2023-01",
    type: "totals",
    total: "120.45",
  },
  {
    sensor: "energy",
    id: "e002",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-21 09:10:10.789Z",
    period: "2023-02",
    type: "totals",
    total: "134.78",
  },
  {
    sensor: "energy",
    id: "e003",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-21 09:10:10.789Z",
    period: "2023-03",
    type: "totals",
    total: "145.12",
  },
  {
    sensor: "energy",
    id: "e004",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-22 15:34:55.222Z",
    period: "2023-04",
    type: "totals",
    total: "156.89",
  },
  {
    sensor: "energy",
    id: "e005",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-19 13:56:03.696Z",
    period: "2023-05",
    type: "totals",
    total: "165.22",
  },
  {
    sensor: "energy",
    id: "e006",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-20 08:22:15.421Z",
    period: "2023-06",
    type: "totals",
    total: "178.56",
  },
  {
    sensor: "energy",
    id: "e007",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-21 09:10:10.789Z",
    period: "2023-07",
    type: "totals",
    total: "185.33",
  },
  {
    sensor: "energy",
    id: "e008",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-22 15:34:55.222Z",
    period: "2023-08",
    type: "totals",
    total: "193.74",
  },
  {
    sensor: "energy",
    id: "e009",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-19 13:56:03.696Z",
    period: "2023-09",
    type: "totals",
    total: "205.11",
  },
  {
    sensor: "energy",
    id: "e010",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-20 08:22:15.421Z",
    period: "2023-10",
    type: "totals",
    total: "218.49",
  },
  {
    sensor: "energy",
    id: "e011",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-21 09:10:10.789Z",
    period: "2023-11",
    type: "totals",
    total: "229.76",
  },
  {
    sensor: "energy",
    id: "e012",
    field: "junin",
    company: "la_rinconada",
    unit: "kWh",
    filter: "accumulator",
    latestUpdate: "2025-09-22 15:34:55.222Z",
    period: "2023-12",
    type: "totals",
    total: "241.12",
  },
  {
    sensor: "air",
    id: "a001",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-19 13:56:03.696Z",
    period: "2023-01",
    type: "totals",
    total: "456.32",
  },
  {
    sensor: "air",
    id: "a002",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-22 15:34:55.222Z",
    period: "2023-02",
    type: "totals",
    total: "478.91",
  },
  {
    sensor: "air",
    id: "a003",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-22 15:34:55.222Z",
    period: "2023-03",
    type: "totals",
    total: "490.25",
  },
  {
    sensor: "air",
    id: "a004",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-20 08:22:15.421Z",
    period: "2023-04",
    type: "totals",
    total: "505.77",
  },
  {
    sensor: "air",
    id: "a005",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-19 13:56:03.696Z",
    period: "2023-05",
    type: "totals",
    total: "523.15",
  },
  {
    sensor: "air",
    id: "a006",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-20 08:22:15.421Z",
    period: "2023-06",
    type: "totals",
    total: "539.48",
  },
  {
    sensor: "air",
    id: "a007",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-21 09:10:10.789Z",
    period: "2023-07",
    type: "totals",
    total: "552.34",
  },
  {
    sensor: "air",
    id: "a008",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-22 15:34:55.222Z",
    period: "2023-08",
    type: "totals",
    total: "564.78",
  },
  {
    sensor: "air",
    id: "a009",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-19 13:56:03.696Z",
    period: "2023-09",
    type: "totals",
    total: "579.22",
  },
  {
    sensor: "air",
    id: "a010",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-20 08:22:15.421Z",
    period: "2023-10",
    type: "totals",
    total: "593.45",
  },
  {
    sensor: "air",
    id: "a011",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-21 09:10:10.789Z",
    period: "2023-11",
    type: "totals",
    total: "606.89",
  },
  {
    sensor: "air",
    id: "a012",
    field: "junin",
    company: "la_rinconada",
    unit: "ppm",
    filter: "accumulator",
    latestUpdate: "2025-09-22 15:34:55.222Z",
    period: "2023-12",
    type: "totals",
    total: "618.33",
  },
];


const monthNames = (month: string) => {
  const [year, m] = month.split("-");
  return new Date(Number(year), Number(m) - 1).toLocaleString("es-ES", {
    month: "long",
  });
};

export default function TotalGraph({data}:{typeSensor?:string, typeUnit?:string, filter?:number, data?:any}) {


  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [fieldSelected, setFieldSelected] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string | null>("");
  const [typeSensorTrend, setTypeSensorTrend] = useState<string>("");
  const [unitSensor, setUnitSensor] = useState<string>("");

  const [dataClean, setDataClean] = useState<any[]>([]);


  const handlerShowDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  }

  const handleDateToFilter = (date: Date | null) => {
    if (!date) return;
    console.log('Date to filter changed:', date);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    console.log(`${year}-${month}-${day}`);
    setDateToFilter(`${year}-${month}-${day}`);
  }

  const handleStyleSensorTrend = (newSensorSelector: string) => {
    setTypeSensorTrend(newSensorSelector);
    if (newSensorSelector === "water") setUnitSensor("ml");
    if (newSensorSelector === "energy") setUnitSensor("kWh");
    if (newSensorSelector === "air") setUnitSensor("ppm");
  }

  const handleFieldSelected = (newFieldSelector: string) => {
    setFieldSelected(newFieldSelector);
  }
  
const prepareData = (data: any[]) => {
  const filtered = data.filter(
    (item) =>
      item.field === fieldSelected &&
      item.latestUpdate.substring(0, 7) === dateToFilter?.substring(0, 7) &&
      item.sensor === typeSensorTrend
  );

  const grouped: Record<string, any[]> = {};
  filtered.forEach((item) => {
    const month = item.period.substring(0, 7); // "YYYY-MM"
    if (!grouped[month]) {
      grouped[month] = [];
    }
    grouped[month].push(item);
  });

  return Object.entries(grouped).map(([month, items]) => {
    const totals = items.map((i) => Number(i.total));

    return {
      ...items[0], // hereda metadatos (sensor, field, etc.)
      total: (totals.reduce((a, b) => a + b, 0)).toFixed(2), // suma de totals del mes
      label: (monthNames(month).charAt(0).toUpperCase() + monthNames(month).slice(1)).substring(0, 3), // nombre del mes abreviado
      unit: unitSensor
    };
  });
};

if (!data || data.length === 0) return <div>Cargando gráfico de consumos...</div>;


  return (
    <div style={{ width: '55%', maxWidth: '1200px', position: 'relative', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
        {showDatePicker && 
          <div style={{ position: 'absolute', top: 80, right: 0, zIndex: 10, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <MyDatePicker handleDateToFilter={handleDateToFilter} />
          </div>
        }
        <h1>Consumos</h1>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
          <div>
            <select style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px' }} value={typeSensorTrend} onChange={(e) => handleStyleSensorTrend(e.target.value)}>
              <option value="Tipo de sensor">Elegir tipo de sensor</option>
              <option value="water">Agua</option>
              <option value="energy">Energía</option>
              <option value="air">Calidad del aire</option>
            </select>
          </div>
          <div>
            <select style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px' }} value={fieldSelected} onChange={(e) => handleFieldSelected(e.target.value)}>
              <option value="Sede">Sede</option>
              <option value="junin">Junin</option>
              <option value="mercedes">Mercedes</option>
              <option value="areco">Areco</option>
              {/* <option value="air">Calidad del aire</option> */}
            </select>
          </div>
          <div>
            <p onClick={handlerShowDatePicker} style={{ backgroundColor: showDatePicker ? 'rgba(219, 239, 144, 0.56)' : '#CAFE16', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>Elegir fecha</p>
          </div>
        </div>
      </div>
      <div>
        <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px', fontWeight: 500, color: '#666' }}>{`Consumo de ${typeSensorTrend === 'water' ? 'Agua' : typeSensorTrend === 'energy' ? 'Energía' : 'Emisión de CO2'} en ${fieldSelected} el ${dateToFilter}`}</p>
      </div>
      <div style={{ width: '100%', height: '500px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={prepareData(data)}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              formatter={(value, name, props: any) => {
                const unit = props.payload?.unit || unitSensor;
                return [`${value} ${unit}`, name];
              }}
            />
            <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};