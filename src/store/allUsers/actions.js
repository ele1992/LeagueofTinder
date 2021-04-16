// import dataBase from "../../firebase";

export const fetchUserSuccess = (users) => ({
  type: "FETCH_USERS_SUCCES",
  payload: users,
});

export const fetchUsers = () => {
  return (dispatch, getState) => {
    // if (dataBase) {
    //   dataBase.collection("Users");
    //     .get()
    //     .then((querySnapshot) => {
    //       const collection = [];
    //       querySnapshot.forEach((player) => {
    //         console.log(player.id);
    //         collection.push({ ...player.data(), id: player.id });
    //       });
    //       dispatch(fetchUserSuccess(collection));
    //     });
    // }
    // console.log(dataBase.collection("Users"));
  };
};
