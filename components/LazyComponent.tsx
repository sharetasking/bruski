// import { useEffect, useState } from 'react';
// import { useInView } from 'react-intersection-observer';
// import dynamic from 'next/dynamic';

// const LazyComponent = ({ children, componentImport }) => {
//   const { ref, inView } = useInView({ triggerOnce: true });
//   const [LoadedComponent, setLoadedComponent] = useState(null);

//   useEffect(() => {
//     if (inView) {
//       const loadComponent = async () => {
//         const Component = await componentImport();
//         setLoadedComponent(Component);
//       };
//       loadComponent();
//     }
//   }, [inView, componentImport]);

//   return <div ref={ref}>{LoadedComponent ? <LoadedComponent /> : children}</div>;
// };

// export default LazyComponent;
