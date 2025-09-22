import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MyDatePicker } from '../DatePicker/DatePicker';

const processData = [
  {
    sensor: "water",
    unit: "ml",
    filter: "year",
    type: "histogramavg",
    year: "2025",
    period: "2025",
    metadata: "mercedes",
    latestUpdate: "2025-09-19 13:56:03.696",
    values_average: "8.386304389480532",
  },
  {
    sensor: "water",
    unit: "ml",
    filter: "year",
    type: "histogramavg",
    year: "2025",
    period: "2025",
    metadata: "junin",
    latestUpdate: "2025-09-19 13:56:03.696",
    values_average: "12.74289384756123",
  },
  {
    sensor: "water",
    unit: "ml",
    filter: "year",
    type: "histogramavg",
    year: "2025",
    period: "2025",
    metadata: "otorrinolaringologo",
    latestUpdate: "2025-09-19 13:56:03.696",
    values_average: "5.98321049283712",
  },
];


const getYearLabel = (dateStr: string) => {
  const date = parseISO(dateStr + "-01-01"); // parseISO necesita formato completo
  return format(date, "yyyy", { locale: es });
}

const data = processData.map(item => ({
  total: Number(item.values_average),
  label: getYearLabel(item.period),
  sede: item.metadata,
}));

export default function HistogramGraph({data }: {data: any[] }) {
  
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [fieldSelected, setFieldSelected] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string | null>("");
  const [typeSensorTrend, setTypeSensorTrend] = useState<string>("");
  const [unitSensor, setUnitSensor] = useState<string>("");

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

  if (!data) {
    return <div>Cargando gráfico de comparativa de sedes...</div>;
  }

  const prepareData = (data: any[]) => {
    const filtered = data.filter(
      (item) => item.sensor === typeSensorTrend
    );

    const grouped: Record<string, any[]> = {};

    filtered.forEach((item) => {
      const month = item.latestUpdate.substring(0, 7); // "YYYY-MM"
      const key = `${item.field}-${month}`; // agrupamos por field + mes

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    return Object.entries(grouped).map(([key, items]) => {
      const avgs = items.map((i) => i.avg);

      const sumAvg = avgs.reduce((a, b) => a + b, 0);
      const avgAvg = avgs.reduce((a, b) => a + b, 0) / avgs.length;

      const [field, month] = key.split("-");

      return {
        field,
        month,        // "YYYY-MM"
        sumAvg: sumAvg.toFixed(2),       // suma de avg del grupo
        avgAvg: avgAvg.toFixed(2),       // promedio de avg del grupo
        count: items.length,
        label: `${items[0].field} - ${month}`,
        unit: unitSensor
      };
    });
  };

    
  return (
    <div id="dashboard-content" style={{ width: '55%', maxWidth: '1200px', position: 'relative', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
        {showDatePicker && 
          <div style={{ position: 'absolute', top: 80, right: 0, zIndex: 10, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <MyDatePicker handleDateToFilter={handleDateToFilter} />
          </div>
        }
        <h1>Comparativa de sedes</h1>
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
            <p onClick={handlerShowDatePicker} style={{ backgroundColor: showDatePicker ? 'rgba(219, 239, 144, 0.56)' : '#CAFE16', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>2025</p>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={prepareData(data)}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
            <Legend />
            <Bar dataKey="sumAvg" name="Total promedio" fill={typeSensorTrend === "water" ? "#75DDF4" : typeSensorTrend === "air" ? "#FF0084" : "#FFD900"} />
          </BarChart>
        </ResponsiveContainer>
      </div>  
    </div>
  );
};
