import { DatePicker } from './components/DatePicker';
import { Input } from './components/Input';
import { Select } from './components/List';
import { Separator } from './components/Separator';

const App = () => {
  return (
    <div className="flex w-96 flex-col gap-3 rounded-lg bg-dark-0 p-5 text-light-0">
      <Input onSelect={console.log} autoFocus placeholder="Script" />
      <Separator />
      <Select
        items={['Alierza', 'Balireza', 'Calireza', 'Saliz']}
        label="Type"
        onSelect={console.log}
        placeholder="Placeholder"
      />
      <Separator />
      <DatePicker />
    </div>
  );
};

export default App;
