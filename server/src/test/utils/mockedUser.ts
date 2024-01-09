export const mockedUser = ({
  isOnline,
}: {
  isOnline: boolean;
}): {
  name: string;
  email: string;
  pictureId: number;
  online: boolean;
} => {
  return {
    name: "Robin",
    email: "test@gmail.com",
    pictureId: 1,
    online: isOnline,
  };
};
