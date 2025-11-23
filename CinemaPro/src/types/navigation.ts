export type RootStackParamList = {
  Auth: undefined;
  Register: undefined;  
  Main: undefined;      // HomeScreen
  Details: {           
    movieId: string; 
    title: string; 
    poster?: string; 
    genre?: string; 
  };
  Booking: { movieTitle: string };
  Snacks: undefined;
};