import { handleFulfill } from "../lib/store-utils";
import { PayloadAction } from "@reduxjs/toolkit";
import supabase from "@/supabase/supabase-client";
import { createSlice, getError } from "../lib/store-utils";
import { FetchedProfilesType, IProfile } from "@/lib/types";

const initialState: IProfile = {
  fetchedProfiles: [],
  data: {},
  maintain: {},
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: (create) => ({
    fetchProfiles: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          const { data, error } = await supabase.from("profiles").select();

          if (error) throw new Error();

          return data;
        } catch (error) {
          return rejectWithValue(error);
        }
      },

      {
        fulfilled: (state, action: PayloadAction<FetchedProfilesType>) => {
          handleFulfill(state);
          state.fetchedProfiles = action.payload;
        },

        pending: (state) => {
          state.maintain.status = "pending";
        },

        rejected: (state, action) => {
          getError<IProfile>(state, action);
        },
      }
    ),

    fetchProfilePage: create.reducer(
      (state, action: PayloadAction<string | undefined>) => {
        const filtered = state.fetchedProfiles.find(
          (profile) => profile.link === action.payload
        );

        if (!filtered)
          return {
            ...state,
            UIError: "Profile not found",
          };

        return {
          ...state,
          data: {
            ...state.data,
            uid: filtered.uid,
            location: filtered.location,
            avatar: filtered.avatar,
            profileName: filtered.username,
            bio: filtered.bio,
            createdAt: filtered.created_at,
            link: filtered.link,
            profileActivity: filtered.activity,
          },
        };
      }
    ),
  }),

  selectors: {
    selectProfileAvatar: (state) => state.data.avatar,
    selectProfileName: (state) => state.data.profileName,
    selectProfileCreatedAt: (state) => state.data.createdAt,
    selectProfileBio: (state) => state.data.bio,
    selectProfileLocation: (state) => state.data.location,
    selectProfileError: (state) => state.UIError,
    selectProfileUID: (state) => state.data.uid,
    selectPending: (state) => state.maintain.status === "pending",
    selectProfiles: (state) => state.fetchedProfiles,
    selectProfileActivity: (state) => state.data.profileActivity,
  },
});

export const {
  selectProfileName,
  selectProfileCreatedAt,
  selectProfileBio,
  selectProfileLocation,
  selectProfileError,
  selectProfileAvatar,
  selectProfileUID,
  selectPending,
  selectProfiles,
  selectProfileActivity,
} = profileSlice.selectors;
export const { fetchProfiles, fetchProfilePage } = profileSlice.actions;

export default profileSlice.reducer;
