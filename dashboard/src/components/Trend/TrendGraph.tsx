'use client'
import { metadata } from '@/app/layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { MyDatePicker } from "@/components/DatePicker/DatePicker";


export default function TrendGraph({data}:{data?:any}) {

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
        item.startTime.startsWith(dateToFilter) &&
        item.sensor === typeSensorTrend
    );

    const grouped: Record<string, any[]> = {};
    filtered.forEach((item) => {
      const minute = item.startTime.substring(0, 16); // "YYYY-MM-DDTHH:mm"
      if (!grouped[minute]) {
        grouped[minute] = [];
      }
      grouped[minute].push(item);
    });

    return Object.entries(grouped).map(([minute, items]) => {
      const mins = items.map((i) => Number(i.min));
      const maxs = items.map((i) => Number(i.max));
      const avgs = items.map((i) => Number(i.avg));

      return {
        ...items[0],
        min: (Math.min(...mins)).toFixed(2),
        max: (Math.max(...maxs)).toFixed(2),
        avg: (avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(2), // promedio de avg
        label: minute.split("T")[1], // hora y minuto
        unit: unitSensor
      };
    });
  };
  

  if (!data) {
    return <div>Cargando gráfico de tendencias...</div>;
  }

  return (
    <div style={{ width: '55%', maxWidth: '1200px', position: 'relative', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px' }}>
                {showDatePicker && 
                  <div style={{ position: 'absolute', top: 80, right: 0, zIndex: 10, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <MyDatePicker handleDateToFilter={handleDateToFilter} />
                  </div>
                }
                <h1>Tendencias</h1>
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
                    </select>
                  </div>
                  <div>
                    <p onClick={handlerShowDatePicker} style={{ backgroundColor: showDatePicker ? 'rgba(219, 239, 144, 0.56)' : '#CAFE16', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>Elegir fecha</p>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px', fontWeight: 500, color: '#666' }}>{`Tendencia de ${typeSensorTrend === 'water' ? 'Agua' : typeSensorTrend === 'energy' ? 'Energía' : 'Emisión de CO2'} en ${fieldSelected} el ${dateToFilter}`}</p>
              </div>
              <div style={{ width: '100%', height: '500px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={500}
                    height={300}
                    data={prepareData(data)}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
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
                    <Legend />
                    <Line type="monotone" dataKey="min" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="avg" stroke="#d130d1ff" />
                    <Line type="monotone" dataKey="max" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          </div>
  );
}
