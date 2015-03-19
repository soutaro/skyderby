# encoding: utf-8
class UserProfileController < ApplicationController
  before_action :set_user, only: [:update]

  def show
    @profile = UserProfile.find(params[:id]) 
  end

  def update
    @profile = @user.user_profile
    @profile.update profile_params
    redirect_to @user
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def profile_params
    params.require(:user_profile).permit(:first_name, :last_name, :homeDZ_name,
                                         :jumps_total, :jumps_wingsuit,
                                         :jumps_last_year, :jumps_wingsuit_last_year,
                                         :jumps_last_3m, :jumps_wingsuit_last_3m,
                                         :userpic, :phone_number,
                                         :facebook_profile, :vk_profile,
                                         :height, :weight, :shirt_size)
  end

end
