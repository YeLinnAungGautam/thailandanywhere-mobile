export const daysBetween = (a, b) => {
    if (a && b) {
      const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
      const startDateTimestamp = new Date(a).getTime();
      const endDateTimestamp = new Date(b).getTime();
      let result = Math.abs(
        Math.round((endDateTimestamp - startDateTimestamp) / oneDay)
      );
      return result;
    }else{
      return 0;
    }
  };