<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:lf="http://www.lifeflowhubbyshaun.com">

  <xsl:output method="html" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>LifeFlowHub Features</title>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .high-importance {
            font-weight: bold;
            color: #ff0000;
          }
        </style>
      </head>
      <body>
        <h1>LifeFlowHub Features</h1>
        <table>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Importance</th>
            <th>User Rating</th>
          </tr>
          <xsl:apply-templates select="lf:lifeflow_features/lf:feature">
            <xsl:sort select="lf:user_rating" order="descending"/>
          </xsl:apply-templates>
        </table>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="lf:feature">
    <tr>
      <td><xsl:value-of select="lf:name"/></td>
      <td><xsl:value-of select="lf:description"/></td>
      <td>
        <xsl:choose>
          <xsl:when test="lf:importance = 'High'">
            <span class="high-importance"><xsl:value-of select="lf:importance"/></span>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="lf:importance"/>
          </xsl:otherwise>
        </xsl:choose>
      </td>
      <td>
        <xsl:if test="lf:user_rating &gt;= 4.5">
          <xsl:value-of select="lf:user_rating"/> (Highly Rated)
        </xsl:if>
        <xsl:if test="lf:user_rating &lt; 4.5">
          <xsl:value-of select="lf:user_rating"/>
        </xsl:if>
      </td>
    </tr>
  </xsl:template>

</xsl:stylesheet>
