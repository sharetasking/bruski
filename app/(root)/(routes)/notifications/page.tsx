import NotificationsFeed from '@/components/NotificationsFeed';

const Notifications = () => {
  return (
    <div className="max-w-3xl mt-12 flex flex-col padding">
      <h2 className="">Notifications</h2>
      <div className="max-w-2xl grow flex flex-col m-auto">
        <NotificationsFeed />
      </div>
    </div>
  );
}
 
export default Notifications;