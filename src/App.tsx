import { Input } from './components/Input';
import { Select } from './components/List';
import { Separator } from './components/Separator';

const App = () => {
  return (
    <div className="flex w-96 flex-col gap-3 rounded-lg bg-bg-800 p-5 text-white">
      <Input autoFocus placeholder="Script" />
      <Separator />
      <Select
        items={['Alierza', 'Balireza', 'Calireza', 'Saliz']}
        label="Type"
        placeholder="Placeholder"
      />
    </div>
  );
};

export default App;
