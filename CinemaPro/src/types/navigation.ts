export type RootStackParamList = {
  Auth: undefined;
  Main: undefined; // Tab Navigator
  Details: { movieId: string; title: string }; 
  Booking: { movieTitle: string };
  Snacks: undefined;
};