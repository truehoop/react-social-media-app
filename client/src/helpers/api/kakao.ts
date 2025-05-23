export interface RegionInfo {
  regionType: string;
  code: string;
  addressName: string;
  region1: string;
  region2: string;
  region3: string;
}

export const getAddressFromCoordinates = async (latitude: number, longitude: number): Promise<RegionInfo | null> => {
  try {
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`, {
      headers: {
        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.documents && data.documents.length > 0) {
      const region = data.documents[0];
      return {
        regionType: region.region_type,
        code: region.code,
        addressName: region.address_name,
        region1: region.region_1depth_name,
        region2: region.region_2depth_name,
        region3: region.region_3depth_name,
      };
    }
    return null;
  } catch {
    return null;
  }
};
