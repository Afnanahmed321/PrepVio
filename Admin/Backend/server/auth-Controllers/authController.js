import { google } from "googleapis";
import crypto from "crypto";
import express from 'express'

import User from "../models/User.js";

let userCredential = null;
const app = express()

const oauth2Client = new google.auth.OAuth2(
  "1035011154617-s9rkb8otl9frnnritj4cae151a1qcrpa.apps.googleusercontent.com",
  "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",
  "http://localhost:5000/oauth2callback"
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];


export const auth = (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");
  req.session.state = state;

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    state: state,
  });

  res.redirect(authorizationUrl);
};

export const oauth2callback = async (req, res) => {
  try {
    const { code, state } = req.query;

    // If user cancels login, code will be missing
    if (!code) {
      return res.redirect(`http://localhost:5173/login`);
      // No res.send here, redirect already ends the response
    }

    if (state !== req.session.state)
      return res.status(403).send("State mismatch");

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    userCredential = tokens;
    console.log(tokens)

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();
    console.log("✅ User info:", data);

    let user = await User.findOne({ email: data.email });
    if (!user) {
      // Create new user
      user = await User.create({
        name: data.name,
        email: data.email,
        picture: data.picture,
      });
    }

    // Redirect to frontend with the token in the URL
    res.redirect(
  `http://localhost:5173/login?token=${tokens.access_token}&name=${encodeURIComponent(user.name)}&picture=${encodeURIComponent(user.picture)}`
);


  } catch (error) {
    console.error("OAuth Error:", error);
    res.status(500).send("Authentication failed");
  }
};


export const revoke = async (req, res) => {
  try {
    if (!userCredential || !userCredential.access_token) {
      return res.send("No token to revoke.");
    }

    await oauth2Client.revokeToken(userCredential.access_token);
    userCredential = null;
    res.send("Token revoked successfully!");
  } catch (err) {
    console.error("Revoke error:", err);
    res.status(500).send("Failed to revoke token.");
  }
};


export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ valid: false, msg: "No token" });

    const token = authHeader.split(" ")[1];
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data } = await oauth2.userinfo.get();

    if (data && data.email) {
      res.json({ valid: true, user: data });
    } else {
      res.status(401).json({ valid: false, msg: "Invalid user info" });
    }
  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
    res.status(401).json({ valid: false, msg: "Verification failed" });
  }
};



