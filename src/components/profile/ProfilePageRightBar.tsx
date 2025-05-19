import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@base/store';
import Following from '@components/profile/Following';
import UserInfo, { ProfileDetailRawDataUnionType } from '@components/profile/UserInfo';
import { companies } from '@helpers/api/companies';
import { usersProfileDetails } from '@helpers/api/profileDetails';

export default function ProfilePageRightBar() {
  const { t } = useTranslation();
  const currentProfileDetail = usersProfileDetails[Math.floor(Math.random() * usersProfileDetails.length)];
  const followedCompanies = companies.filter((company) => company.id > 0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCompanyClick = (companyId: number) => {
    navigate(`/company/${companyId}`);
  };

  const profileDetails = Object.keys(currentProfileDetail) as ProfileDetailRawDataUnionType[];

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="birthdayContainer">
          <img
            className="birthdayImg"
            src="assets/gift.png"
            alt=""
          />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
          </span>
        </div>
        <img
          className="rightbarAd"
          src="assets/ad.png"
          alt=""
        />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {followedCompanies.map((company) => (
            <li
              key={company.id}
              className="rightbarFriend"
              onClick={() => handleCompanyClick(company.id)}
            >
              <div className="rightbarProfileImgContainer">
                <img
                  className="rightbarProfileImg"
                  src={company.logo}
                  alt=""
                />
                <span className="rightbarOnline"></span>
              </div>
              <span className="rightbarUsername">{company.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
