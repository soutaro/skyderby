# == Schema Information
#
# Table name: tournament_match_competitors
#
#  id                       :integer          not null, primary key
#  result                   :decimal(10, 3)
#  tournament_competitor_id :integer
#  tournament_match_id      :integer
#  track_id                 :integer
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#

class TournamentMatchCompetitor < ActiveRecord::Base
  belongs_to :tournament_competitor
  belongs_to :tournament_match
  belongs_to :track

  before_save :calculate_result

  delegate :start_time, to: :tournament_match

  def calculate_result
    return unless track
    return if (result || 0) > 0

    track_points = Skyderby::Tracks::Points.new(track)
    self.result = Skyderby::ResultsProcessors::TimeUntilIntersection.new(
      track_points, start_time: start_time, finish_line: finish_line
    ).calculate
  end

  def finish_line
    tournament = tournament_match.round.tournament
    [
      Skyderby::Tracks::TrackPoint.new(
        latitude: tournament.finish_start_lat,
        longitude: tournament.finish_start_lon
      ),
      Skyderby::Tracks::TrackPoint.new(
        latitude: tournament.finish_end_lat,
        longitude: tournament.finish_end_lon
      )
    ]
  end
end
