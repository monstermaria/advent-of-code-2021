import java.util.ArrayList;
import java.util.Date;

public class Day15Array {
  static ArrayList<ArrayList<Integer>> riskLevelMap = new ArrayList<>();
  static int[][] riskLevelArray;
  static int[][] lowestRiskArray;
  static int lowestRisk = Integer.MAX_VALUE;
  static int numberOfRows;
  static int numberOfColumns;

  static void getRiskLevelMap(ArrayList<String> inputLines) {
    for (int row = 0; row < inputLines.size(); row++) {

      String riskRow = inputLines.get(row);

      if (riskRow.equals("")) {
        continue;
      }

      riskLevelMap.add(new ArrayList<>());

      for (int column = 0; column < riskRow.length(); column++) {

        riskLevelMap.get(row).add(Integer.parseInt(riskRow.substring(column, column + 1)));
      }
    }

    numberOfRows = riskLevelMap.size();
    numberOfColumns = riskLevelMap.get(0).size();

    riskLevelArray = new int[numberOfRows][numberOfColumns];
    lowestRiskArray = new int[numberOfRows][numberOfColumns];


    for (int row = 0; row < numberOfRows; row++) {

      for (int column = 0; column < numberOfColumns; column++) {

        riskLevelArray[row][column] = riskLevelMap.get(row).get(column).intValue();
        lowestRiskArray[row][column] = Integer.MAX_VALUE;
      }
    }
  }

  static void calculateRouteRisk(int row, int column, int risk) {

    risk += riskLevelArray[row][column];

    if (risk >= lowestRiskArray[row][column]) {
      return;
    }

    if (risk >= lowestRisk) {
      return;
    }

    lowestRiskArray[row][column] = risk;

    if (row == numberOfRows - 1 && column == numberOfColumns - 1) {
      lowestRisk = risk;
      return;
    }

    if (row < numberOfRows - 1) {
      calculateRouteRisk(row + 1, column, risk);
    }

    if (column < numberOfColumns - 1) {
      calculateRouteRisk(row, column + 1, risk);
    }

    if (column > 0) {
      calculateRouteRisk(row, column - 1, risk);
    }

    if (row > 0) {
      calculateRouteRisk(row - 1, column, risk);
    }
  }

  public static void main(String[] args) {
    ArrayList<String> inputLines = FileUtilities.readInputFromFile("./riskLevel.txt");

    getRiskLevelMap(inputLines);

    Date start = new Date();

    calculateRouteRisk(0, 0, -riskLevelArray[0][0]);

    Date stop = new Date();

    long timeInMilliseconds = stop.getTime() - start.getTime();

    System.out.println("Time to calculate route risk: " + timeInMilliseconds / 1000);

    System.out.println("The lowest risk is " + lowestRisk);
  }
}
