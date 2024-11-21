import { getProfile, handleFulfill } from "../lib/store-utils";
import { PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/supabase/supabase-client";
import { createSlice, getError } from "../lib/store-utils";
import { FetchedProfileType, IProfile } from "@/lib/types";

const initialState: IProfile = {
  data: {},
  maintain: {},
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: (create) => ({
    fetchProfilePage: create.asyncThunk(
      async (userUrl: string | undefined, { rejectWithValue }) => {
        try {
          if (!userUrl) throw new Error();

          const { data } = await supabase
            .from("profiles")
            .select()
            .eq("link", userUrl);

          if (!data || !data[0]) throw new Error("User not found!");

          return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<FetchedProfileType>) => {
          handleFulfill(state);
          getProfile(state, action.payload);
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IProfile>(state, action);
        },
      }
    ),
  }),

  selectors: {
    selectProfileAvatar: (state) => state.data.avatar,
    selectProfileStatus: (state) => state.data.status,
    selectProfileName: (state) => state.data.profileName,
    selectProfileCreatedAt: (state) => state.data.createdAt,
    selectProfileBio: (state) => state.data.bio,
    selectProfileLocation: (state) => state.data.location,
    selectProfileError: (state) => state.UIError,
    selectProfileUID: (state) => state.data.uid,
  },
});

export const {
  selectProfileStatus,
  selectProfileName,
  selectProfileCreatedAt,
  selectProfileBio,
  selectProfileLocation,
  selectProfileError,
  selectProfileAvatar,
  selectProfileUID,
} = profileSlice.selectors;
export const { fetchProfilePage } = profileSlice.actions;

export default profileSlice.reducer;
