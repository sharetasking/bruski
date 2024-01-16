import { format } from 'date-fns';

const DateFormatter = ({ dateString }: { dateString: string }) => {
  // Move the formattedDate constant inside the component body
  const formattedDate = dateString;//format(new Date(dateString), 'PPPpp');

  return <div>{formattedDate}</div>;
};

export default DateFormatter;
